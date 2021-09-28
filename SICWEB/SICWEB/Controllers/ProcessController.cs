
    using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SICWEB.DbFactory;
using SICWEB.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SICWEB.Controllers
{

    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ProcessController : ControllerBase
    {
        private readonly ConfeccionMssqlDbContext _context_MS;
        private readonly MaintenanceMssqlDbContext _context_MS2;
        private readonly string _engine;
        [Obsolete]
        private IHostingEnvironment Environment;

        [Obsolete]
        public ProcessController(
            ConfeccionMssqlDbContext context_MS,
            MaintenanceMssqlDbContext context_MS2,
            IConfiguration configuration,
            IHostingEnvironment _environment
        )
        {
            _context_MS = context_MS;
            _context_MS2 = context_MS2;
            _engine = configuration.GetConnectionString("ActiveEngine");
            Environment = _environment;

        }

        [HttpGet]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult allProcess()
        {
            if (_engine.Equals("MSSQL"))
            {
                try
                {
                    return Ok(_context_MS.PROCESO.ToArray());
                }
                catch (Exception e)
                {
                    return NotFound();
                }

            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult getEstiloProcess([FromBody] IdKey2 id)
        {
            if (_engine.Equals("MSSQL"))
            {
                var result = _context_MS.ESTILO_PROCESO.Where(u => u.estilo_c_iid.Equals(int.Parse(id.id))).ToArray();
      
                var query = from A in _context_MS.Set<T_ESTILO_PROCESO>()
                            join B in _context_MS.Set<T_ESTILO_PROCESO_DETALLE>()
                                on A.esti_proceso_c_iid equals B.esti_proceso_c_iid
                            select new
                            {
                                A.estilo_c_iid,
                                A.esti_proceso_c_iid
                                ,
                                A.proceso_c_vid
                                ,
                                B.esti_proc_detalle_c_vdescripcion
                                ,
                                B.esti_proc_detalle_c_ecosto
                                ,
                                B.esti_proc_detalle_c_isegundos
                            };
                query = query.Where(c => c.estilo_c_iid.Equals(int.Parse(id.id)));
                return Ok(query);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult saveEstiloProcess([FromBody] NewProcess process)
        {
            if (_engine.Equals("MSSQL"))
            {
                if (process.id < 0)
                {
                   

                    for (int i = 0; i < process.estiloProcesses.Length; i++)
                    {
                        EstiloProcess _temp = process.estiloProcesses[i];
                        if (_temp.esti_proceso_c_iid > 0)
                        {
                            T_ESTILO_PROCESO _process = _context_MS.ESTILO_PROCESO.Where(u => u.esti_proceso_c_iid.Equals(_temp.esti_proceso_c_iid)).First(); 
                            T_ESTILO_PROCESO_DETALLE _detail = _context_MS.ESTILO_PROCESO_DETALLE.Where(u => u.esti_proceso_c_iid.Equals(_temp.esti_proceso_c_iid)).First();
                            _process.estilo_c_iid = process.estilo_c_iid;
                            _process.proceso_c_vid = _temp.proceso_c_vid;
                            _process.estilo_proceso_c_ecosto = _temp.esti_proc_detalle_c_ecosto;
                            _context_MS.ESTILO_PROCESO.Update(_process);
                            _context_MS.SaveChanges();
                            _detail.esti_proceso_c_iid = _process.esti_proceso_c_iid;
                            _detail.esti_proc_detalle_c_vdescripcion = _temp.esti_proc_detalle_c_vdescripcion;
                            _detail.esti_proc_detalle_c_isegundos = _temp.esti_proc_detalle_c_isegundos;
                            _detail.esti_proc_detalle_c_ecosto = _temp.esti_proc_detalle_c_ecosto;
                            _detail.esti_proceso_c_yorden = 1;
                            _context_MS.ESTILO_PROCESO_DETALLE.Update(_detail);
                            _context_MS.SaveChanges();

                        } else {
                            T_ESTILO_PROCESO _process = new();
                            T_ESTILO_PROCESO_DETALLE _detail = new();
                            _process.estilo_c_iid = process.estilo_c_iid;
                            _process.proceso_c_vid = _temp.proceso_c_vid;
                            _process.estilo_proceso_c_ecosto = _temp.esti_proc_detalle_c_ecosto;
                            _context_MS.ESTILO_PROCESO.Add(_process);
                            _context_MS.SaveChanges();
                            _detail.esti_proceso_c_iid = _process.esti_proceso_c_iid;
                            _detail.esti_proc_detalle_c_vdescripcion = _temp.esti_proc_detalle_c_vdescripcion;
                            _detail.esti_proc_detalle_c_isegundos = _temp.esti_proc_detalle_c_isegundos;
                            _detail.esti_proc_detalle_c_ecosto = _temp.esti_proc_detalle_c_ecosto;
                            _detail.esti_proceso_c_yorden = 1;
                            _context_MS.ESTILO_PROCESO_DETALLE.Add(_detail);
                            _context_MS.SaveChanges();
                        }
                        

                    }
                    return Ok();
                }
                else
                {
                    /*var _item = _context_MS.ESTILO.Where(e => e.estilo_c_iid.Equals(style.id)).FirstOrDefault();
                    _item.estilo_c_vcodigo = style.code;
                    _item.estilo_c_vnombre = style.name;
                    _item.estilo_c_vdescripcion = style.description;
                    _item.itm_c_iid = style.item;
                    _item.marca_c_vid = style.brand;
                    _item.marca_categoria_c_vid = style.category;
                    _item.marca_color_c_vid = style.color;
                    _context_MS.ESTILO.Update(_item);
                    _context_MS.SaveChanges();

                    var _dItem = _context_MS.ESTILO_TALLA.Where(u => u.estilo_c_iid.Equals(_item.estilo_c_iid)).ToList();

                    _context_MS.ESTILO_TALLA.RemoveRange(_dItem);
                    _context_MS.SaveChanges();

                    for (int i = 0; i < style.sizes.Length; i++)
                    {
                        if (style.sizes[i].check == true)
                        {
                            T_ESTILO_TALLA __item = new();
                            __item.talla_c_vid = style.sizes[i].key;
                            __item.estilo_c_iid = _item.estilo_c_iid;
                            _context_MS.ESTILO_TALLA.Add(__item);
                            _context_MS.SaveChanges();
                        }
                    }
                    return Ok(_item.estilo_c_iid);*/
                }
            }
            else
            {
                return Ok();
            }
            return Ok();
        }

    }
}
