
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
    public class UserController : ControllerBase
    {
        private readonly MainMssqlDbContext _context_SS;
        private readonly string _engine;
        public UserController(
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
        public IActionResult Users([FromBody] SearchUserKey searchKey)
        {
            if (_engine.Equals("MSSQL"))
            {

                var query = from A in _context_SS.Set<T_USUARIO>()
                            join P in _context_SS.Set<T_USUARIO_PERFIL>() on A.Usua_c_cdoc_id equals P.Usua_c_cdoc_id into D
                            from M in D.DefaultIfEmpty()
                            join PP in _context_SS.Set<T_PERFIL>() on M.Perf_c_yid equals PP.Perf_c_yid into F
                            from FF in F.DefaultIfEmpty()
                            select new
                            {
                                user = A.Usua_c_cdoc_id,
                                networkuser = A.Usua_c_cusu_red,
                                name = A.Usua_c_cape_nombres,
                                lastname = A.Usua_c_cape_pat,
                                mlastname = A.Usua_c_cape_mat,
                                profile = FF.Perf_c_vnomb,
                                profile_id = FF.Perf_c_yid,
                                password = A.Usua_c_vpass,
                                role = "",
                                roleprinciple = "",
                                estado = A.Usua_c_bestado == true ? 1 : 0
                            };

                if (!(searchKey.user == null) && !searchKey.user.Equals(""))
                {
                    query = query.Where(c => c.user.Contains(searchKey.user));

                }
                if (!(searchKey.networkuser == null) && !searchKey.networkuser.Equals(""))
                {
                    query = query.Where(c => c.networkuser.Contains(searchKey.networkuser));

                }
                if (!(searchKey.name == null) && !searchKey.name.Equals(""))
                {
                    query = query.Where(c => c.name.Contains(searchKey.name));

                }
                if (!(searchKey.surname == null) && !searchKey.surname.Equals(""))
                {
                    query = query.Where(c => c.lastname.Contains(searchKey.surname));

                }

                if (!(searchKey.state == -1))
                {
                    query = query.Where(c => c.estado.Equals(searchKey.state));
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
        public IActionResult Getprofiles()
        {
            if (_engine.Equals("MSSQL"))
            {

                var query = from A in _context_SS.Set<T_PERFIL>()
                            select new
                            {
                                A.Perf_c_yid,
                                A.Perf_c_vnomb
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
        public IActionResult Saveuser([FromBody] NewUser user)
        {
            if (_engine.Equals("MSSQL"))
            {
                if (user.method == -1)
                {
                    T_USUARIO _user = new();
                    _user.Usua_c_cape_nombres = user.name;
                    _user.Usua_c_cape_pat = user.lastname;
                    _user.Usua_c_cape_mat = user.mlastname;
                    _user.Usua_c_cdoc_id = user.user;
                    _user.Usua_c_vpass = user.password;
                    _user.Usua_c_bestado = user.estado;
                    _context_SS.User.Add(_user);
                    try
                    {
                        _context_SS.SaveChanges();

                        T_USUARIO_PERFIL _user_profile = new();
                        _user_profile.Perf_c_yid = user.profile_id;
                        _user_profile.Usua_c_cdoc_id = user.user;
                        _user_profile.Usua_perfil_c_cestado = '1';
                        _context_SS.UserProfile.Add(_user_profile);
                        _context_SS.SaveChanges();

                    }
                    catch (Exception e)
                    {
                        return NotFound();
                    }


                    return Ok();
                }
                else
                {
                    var _user = _context_SS.User.Where(e => e.Usua_c_cdoc_id.Equals(user.user)).FirstOrDefault();
                    _user.Usua_c_cape_nombres = user.name;
                    _user.Usua_c_cape_pat = user.lastname;
                    _user.Usua_c_cape_mat = user.mlastname;
                    _user.Usua_c_vpass = user.password;
                    _user.Usua_c_bestado = user.estado;
                    _context_SS.User.Update(_user);
                    _context_SS.SaveChanges();

                    var _userProfile = _context_SS.UserProfile.Where(e => e.Usua_c_cdoc_id.Equals(user.user)).FirstOrDefault();
                    _userProfile.Perf_c_yid = user.profile_id;
                    _context_SS.UserProfile.Update(_userProfile);
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
        public IActionResult Deleteuser([FromBody] IdKey2 item)
        {
            if (_engine.Equals("MSSQL"))
            {
                var _item = _context_SS.UserProfile.Where(u => u.Usua_c_cdoc_id.Equals(item.id)).FirstOrDefault();
                if (!(_item == null))
                {
                    _context_SS.UserProfile.Remove(_item);
                    _context_SS.SaveChanges();

                    var _user = _context_SS.User.Where(u => u.Usua_c_cdoc_id.Equals(item.id)).FirstOrDefault();
                    if (!(_user == null))
                    {
                        _context_SS.User.Remove(_user);
                        _context_SS.SaveChanges();
                    }

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
