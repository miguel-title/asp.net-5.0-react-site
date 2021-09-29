using System;

namespace SICWEB.Models
{
    public class NewMenu
    {
        public int id { get; set; }
        public int? parent_id { get; set; }
        public string menu { get; set; }
        public byte? nivel { get; set; }
        public string pagina { get; set; }
        public bool estado { get; set; }
    }
}