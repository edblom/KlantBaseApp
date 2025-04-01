using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KlantBaseWebDemo.Models.KlantBase
{
    [Table("stblAfwerking", Schema = "dbo")]
    public partial class StblAfwerking
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("omschrijving")]
        public string Omschrijving { get; set; }
    }
}