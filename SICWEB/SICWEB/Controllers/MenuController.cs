
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
                            from m in Detail.DefaultIfEmpty()
                            select new
                            {
                                menu_c_iid = A.Menu_c_iid,
                                parent_menu_c_iid = A.Menu_c_iid_padre,
                                menu_c_vnomb = A.Menu_c_vnomb,
                                parent_menu_c_vnomb = m.Menu_c_vnomb,
                                menu_c_ynivel = A.Menu_c_ynivel,
                                menu_c_vpag_asp = A.Menu_c_vpag_asp,
                                opciones = "",
                                estado = ""
                            };

                if (!(searchKey.menu == null) && !searchKey.menu.Equals(""))
                {
                    query = query.Where(c => c.menu_c_vnomb.Contains(searchKey.menu));

                }
                if (!(searchKey.parent_menu == null) && !searchKey.parent_menu.Equals(""))
                {
                    query = query.Where(c => c.parent_menu_c_vnomb.Contains(searchKey.parent_menu));
                }

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

    }
}
