using Microsoft.EntityFrameworkCore;
using System;

namespace ActielijstApi.Data // Pas de namespace aan als je projectnaam anders is
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<ActionItem> Actions { get; set; }
    }

    public class ActionItem
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Assignee { get; set; }
        public DateTime DueDate { get; set; }
        public string Status { get; set; }
        public string Creator { get; set; }
    }
}
