using Microsoft.AspNetCore.Builder; // Voor WithOpenApi
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using ActielijstApi.Data;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

// Services toevoegen
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Actielijst API", Version = "v1" });
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
});

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Actielijst API v1");
        c.RoutePrefix = "swagger"; // Blijft op /swagger zoals je nu hebt
    });
}
else
{
    app.UseExceptionMiddleware();
}

app.UseCors("AllowAll");

// Endpoints (vervangt ActionsController)
app.MapGet("/api/actions/user/{userId}/{filterType}", async (string userId, string filterType, ApplicationDbContext context) =>
{
    switch (filterType.ToLower())
    {
        case "assigned":
            return Results.Ok(await context.Actions.Where(a => a.Assignee == userId).ToListAsync());
        case "created":
            return Results.Ok(await context.Actions.Where(a => a.Creator == userId).ToListAsync());
        default:
            return Results.Ok(await context.Actions.Where(a => a.Assignee == userId || a.Creator == userId).ToListAsync());
    }
})
.WithName("GetActionsForUser")
.WithOpenApi();

app.MapPost("/api/actions", async (ActionItem action, ApplicationDbContext context) =>
{
    context.Actions.Add(action);
    await context.SaveChangesAsync();
    return Results.Created($"/api/actions/user/{action.Assignee}/assigned", action);
})
.WithName("PostAction")
.WithOpenApi();

app.MapPut("/api/actions/{id}", async (int id, ActionItem action, ApplicationDbContext context) =>
{
    if (id != action.Id) return Results.BadRequest();
    context.Entry(action).State = EntityState.Modified;
    await context.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("PutAction")
.WithOpenApi();

app.MapDelete("/api/actions/{id}", async (int id, ApplicationDbContext context) =>
{
    var action = await context.Actions.FindAsync(id);
    if (action == null) return Results.NotFound();
    context.Actions.Remove(action);
    await context.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("DeleteAction")
.WithOpenApi();

// Nieuwe test-error endpoint
app.MapGet("/api/test-error", () =>
{
    throw new ArgumentException("Dit is een testfout!");
})
.WithName("TestError")
.WithOpenApi(operation =>
{
    operation.Summary = "Testendpoint om een fout te simuleren";
    operation.Responses["500"] = new OpenApiResponse { Description = "Interne serverfout" };
    return operation;
});

// Exception Middleware (inline gedefinieerd)
app.UseExceptionMiddleware();

// Start de app
app.Run();

// Exception Middleware Klasse
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Een onverwerkte fout is opgetreden.");
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new { error = ex.Message }));
        }
    }
}

public static class ExceptionMiddlewareExtensions
{
    public static IApplicationBuilder UseExceptionMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ExceptionMiddleware>();
    }
}