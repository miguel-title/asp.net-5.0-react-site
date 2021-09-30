
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SICWEB.DbFactory;
using SICWEB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SICWEB.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class MenuController : ControllerBase
    {
        private readonly MainMssqlDbContext _context_SS;
        private readonly string _engine;
        public MenuController(
            MainMssqlDbContext context_SS,
            IConfiguration configuration
        )
        {
            _context_SS = context_SS;
            _engine = configuration.GetConnectionString("ActiveEngine");

        }

        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Menus([FromBody] SearchMenuKey searchKey)
        {
            if (_engine.Equals("MSSQL"))
            {

                var query = from A in _context_SS.Set<T_MENU>()
                            join E in _context_SS.Set<T_MENU>() on A.Menu_c_iid_padre equals E.Menu_c_iid into Detail
                            from M in Detail.DefaultIfEmpty()
                            join O in (
                                from G in _context_SS.Set<T_MENU_OPCION>() 
                                group G by G.Menu_c_iid into grouping 
                                select new {
                                    menu_c_iid = grouping.Key,
                                    count = grouping.Count()
                                }
                            ) on A.Menu_c_iid equals O.menu_c_iid into Opc
                            from F in Opc.DefaultIfEmpty()
                            select new
                            {
                                menu_c_iid = A.Menu_c_iid,
                                parent_menu_c_iid = A.Menu_c_iid_padre == null ? -1 : A.Menu_c_iid_padre,
                                menu_c_vnomb = A.Menu_c_vnomb,
                                parent_menu_c_vnomb = M.Menu_c_vnomb,
                                menu_c_ynivel = A.Menu_c_ynivel,
                                menu_c_vpag_asp = A.Menu_c_vpag_asp,
                                opciones = F.count == null ? 0 : 1,
                                estado = A.Menu_c_bestado// == true ? 1 : 0
                            };

                if (!(searchKey.menu == null) && !searchKey.menu.Equals(""))
                {
                    query = query.Where(c => c.menu_c_vnomb.Contains(searchKey.menu));

                }
                if (!(searchKey.parent_id == -1))
                {
                    query = query.Where(c => c.parent_menu_c_iid.Equals(searchKey.parent_id));
                }

                if (!(searchKey.state == -1))
                {
                    query = query.Where(c => c.estado.Equals(searchKey.state == 1 ? true : false));
                }

                return Ok(query);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Parentmenus()
        {
            if (_engine.Equals("MSSQL"))
            {

                var query = from A in _context_SS.Set<T_MENU>()
                            where A.Menu_c_iid_padre == null
                            select new
                            {
                                A.Menu_c_iid,
                                A.Menu_c_vnomb
                            };


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
        public IActionResult Savemenu([FromBody] NewMenu menu)
        {
            if (_engine.Equals("MSSQL"))
            {
                if (menu.id < 0)
                {
                    T_MENU _menu = new();
                    if (menu.parent_id != -1)
                    {
                        _menu.Menu_c_iid_padre = menu.parent_id;
                    }
                    _menu.Menu_c_vnomb = menu.menu;
                    _menu.Menu_c_ynivel = menu.nivel;
                    _menu.Menu_c_vpag_asp = menu.pagina;
                    _menu.Menu_c_bestado = menu.estado;
                    _context_SS.Menu.Add(_menu);
                    _context_SS.SaveChanges();
                    return Ok();
                }
                else
                {
                    var _menu = _context_SS.Menu.Where(e => e.Menu_c_iid.Equals(menu.id)).FirstOrDefault();
                    if (menu.parent_id != -1)
                    {
                        _menu.Menu_c_iid_padre = menu.parent_id;
                    }
                    else
                    {
                        _menu.Menu_c_iid_padre = null;
                    }
                    _menu.Menu_c_vnomb = menu.menu;
                    _menu.Menu_c_ynivel = menu.nivel;
                    _menu.Menu_c_vpag_asp = menu.pagina;
                    _menu.Menu_c_bestado = menu.estado;
                    _context_SS.Menu.Update(_menu);
                    _context_SS.SaveChanges();
                    return Ok();
                }
            }
            else
            {
                return Ok();
            }
        }

        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Saveopc([FromBody] NewOPC OPC)
        {
            if (_engine.Equals("MSSQL"))
            {
                int intIdt = _context_SS.Opc.Max(u => u.Opc_c_iid);

                T_OPCION _opc = new();
                _opc.Opc_c_iid = intIdt + 1;
                _opc.Opc_c_vdesc= OPC.vdesc;
                _opc.Opc_c_bestado = OPC.estado;
                _context_SS.Opc.Add(_opc);
                _context_SS.SaveChanges();

                T_MENU_OPCION _menu_opc = new();
                _menu_opc.Menu_c_iid = OPC.menuID;
                _menu_opc.Opc_c_iid = intIdt + 1;
                _menu_opc.Menu_opcion_c_bestado = OPC.estado;
                _context_SS.MenuOpc.Add(_menu_opc);
                _context_SS.SaveChanges();

                return Ok();
            }
            else
            {
                return Ok();
            }
        }


        [HttpPost]
        [Authorize(Roles = "cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Deletemenu([FromBody] IdKey item)
        {
            if (_engine.Equals("MSSQL"))
            {
                var _item = _context_SS.Menu.Where(u => u.Menu_c_iid.Equals(item.id)).FirstOrDefault();
                if (!(_item == null))
                {
                    _context_SS.Menu.Remove(_item);
                    _context_SS.SaveChanges();
                    return Ok();
                }
                else
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
        public IActionResult Opcs([FromBody] IdKey item)
        {
            if (_engine.Equals("MSSQL"))
            {
                var query = from A in _context_SS.Set<T_MENU_OPCION>()
                            join E in _context_SS.Set<T_OPCION>() on A.Opc_c_iid equals E.Opc_c_iid into Detail
                            from M in Detail.DefaultIfEmpty()
                            select new
                            {
                                A.Menu_c_iid,
                                M.Opc_c_iid,
                                M.Opc_c_vdesc,
                                M.Opc_c_bestado
                            };

                query = query.Where(c => c.Menu_c_iid.Equals(item.id));

                return Ok(query);
            }
            else
            {
                return NotFound();
            }
        }

    }
}
