using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace SICWEB.Models
{    

    public class NewProcess
    {
        public int id { get; set; }
        public int estilo_c_iid { get; set; }
        public EstiloProcess[] estiloProcesses { get; set; }
    }

    public class EstiloProcess
    {
        public int esti_proceso_c_iid { get; set; }
        public string proceso_c_vid { get; set; }
        public string esti_proc_detalle_c_vdescripcion { get; set; }
        public Decimal esti_proc_detalle_c_ecosto { get; set; }
        public Decimal esti_proc_detalle_c_isegundos { get; set; }
    }

}