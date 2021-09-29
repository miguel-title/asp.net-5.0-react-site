namespace SICWEB.Models
{
    public class SearchKey
    {
        public int family { get; set; }
        public int subFamily { get; set; }
        public string code { get; set; }
        public string description { get; set; }
    }

    public class SearchMenuKey
    {
        public string menu { get; set; }
        public int parent_id { get; set; }
        public int state { get; set; }
    }

    public class SearchClientKey
    {
        public string company { get; set; }
        public string ruc { get; set; }
        public bool client { get; set; }
        public bool provider { get; set; }
    }

    public class SearchStyleKey
    {
        public string code { get; set; }
        public string name { get; set; }
        public string color { get; set; }
    }
}