using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SICWEB.DbFactory
{
    public class MainMssqlDbContext : DbContext
    {
        public string Schema = "Seguridad";
        public string Prefix = "SIC_";
        public string CurrentUserId { get; set; }

        public DbSet<T_USUARIO> USUARIO { get; set; }
        public DbSet<T_MENU> Menu { get; set; }
        public DbSet<T_MENU_OPCION> MenuOpc { get; set; }

        public DbSet<T_OPCION> Opc { get; set; }

        public DbSet<T_USUARIO> User { get; set; }
        public DbSet<T_USUARIO_PERFIL> UserProfile { get; set; }

        public MainMssqlDbContext(DbContextOptions<MainMssqlDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<T_MENU>().ToTable(Prefix + "T_MENU", Schema);
            builder.Entity<T_MENU>().HasKey(p => p.Menu_c_iid);
            builder.Entity<T_MENU>().Property(p => p.Menu_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_MENU_OPCION>().ToTable(Prefix + "T_MENU_OPCION", Schema);
            builder.Entity<T_MENU_OPCION>().HasKey(p => p.Menu_opcion_c_iid);
            builder.Entity<T_MENU_OPCION>().Property(p => p.Menu_opcion_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_OPCION>().ToTable(Prefix + "T_OPCION", Schema);
            builder.Entity<T_OPCION>().HasKey(p => p.Opc_c_iid);
            builder.Entity<T_OPCION>().Property(p => p.Opc_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_PERFIL>().ToTable(Prefix + "T_PERFIL", Schema);
            builder.Entity<T_PERFIL>().HasKey(p => p.Perf_c_yid);
            builder.Entity<T_PERFIL>().Property(p => p.Perf_c_yid).ValueGeneratedOnAdd();

            builder.Entity<T_PERFIL_MENU>().ToTable(Prefix + "T_PERFIL_MENU", Schema);
            builder.Entity<T_PERFIL_MENU>().HasKey(p => new { p.Perf_c_yid, p.Menu_c_iid });
            builder.Entity<T_PERFIL_MENU>().Property(p => p.Perf_c_yid).ValueGeneratedOnAdd();

            builder.Entity<T_PERFIL_OPCION>().ToTable(Prefix + "T_PERFIL_OPCION", Schema);
            builder.Entity<T_PERFIL_OPCION>().HasKey(p => new { p.Opc_c_iid, p.Perf_c_yid });
            builder.Entity<T_PERFIL_OPCION>().Property(p => p.Opc_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_USUARIO>().ToTable(Prefix + "T_USUARIO", Schema);
            builder.Entity<T_USUARIO>().HasKey(p => p.Usua_c_cdoc_id);
            builder.Entity<T_USUARIO>().Property(p => p.Usua_c_cdoc_id).ValueGeneratedOnAdd();

            builder.Entity<T_USUARIO_OPCION>().ToTable(Prefix + "T_USUARIO_OPCION", Schema);
            builder.Entity<T_USUARIO_OPCION>().HasKey(p => new { p.Opc_c_iid, p.Usua_c_cdoc_id });
            builder.Entity<T_USUARIO_OPCION>().Property(p => p.Opc_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_USUARIO_PERFIL>().ToTable(Prefix + "T_USUARIO_PERFIL", Schema);
            builder.Entity<T_USUARIO_PERFIL>().HasKey(p => new { p.Usua_c_cdoc_id, p.Usua_perfil_c_cestado });
            builder.Entity<T_USUARIO_PERFIL>().Property(p => p.Usua_c_cdoc_id).ValueGeneratedOnAdd();

        }

        public override int SaveChanges()
        {
            UpdateAuditEntities();
            return base.SaveChanges();
        }
        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            UpdateAuditEntities();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(cancellationToken);
        }
        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void UpdateAuditEntities()
        {
            var modifiedEntries = ChangeTracker.Entries()
                .Where(x => x.Entity is IAuditableEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            foreach (var entry in modifiedEntries)
            {
                var entity = (IAuditableEntity)entry.Entity;
                DateTime now = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedDate = now;
                    entity.CreatedBy = CurrentUserId;
                }
                else
                {
                    base.Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                    base.Entry(entity).Property(x => x.CreatedDate).IsModified = false;
                }
                entity.UpdatedDate = now;
                entity.UpdatedBy = CurrentUserId;
            }
        }

    }

    public class MaintenanceMssqlDbContext : DbContext
    {
        public string Schema = "Mantenimiento";
        public string Prefix = "SIC_";
        public string CurrentUserId { get; set; }

        public DbSet<T_ITEM_FAMILIA> ITEM_FAMILIA { get; set; }
        public DbSet<T_ITEM_SUB_FAMILIA> ITEM_SUB_FAMILIA { get; set; }
        public DbSet<T_SEGMENTO> SEGMENTO { get; set; }
        public DbSet<T_PRODUCTO_PARTIDA> PRODUCTO_PARTIDA { get; set; }
        public DbSet<T_UNIDAD_MEDIDA> UNIDAD_MEDIDA { get; set; }
        public DbSet<T_ITEM> ITEM { get; set; }
        public DbSet<T_ZONA_REPARTO> ZONA_REPARTO { get; set; }
        public DbSet<T_DEPARTAMENTO> DEPARTAMENTO { get; set; }
        public DbSet<T_PROVINCIA> PROVINCIA { get; set; }
        public DbSet<T_DISTRITO> DISTRITO { get; set; }
        public DbSet<T_CLI_CONTAC_CARGO> CLI_CONTAC_CARGO { get; set; }
        public DbSet<T_CLI_CONTACTO> CLI_CONTACTO { get; set; }
        public DbSet<T_CLIENTE> CLIENTE { get; set; }
        public DbSet<T_NOMB_COM> NOMB_COM { get; set; }
        public DbSet<T_CLI_DIRECCION> CLI_DIRECCION { get; set; }
        public DbSet<T_EMPRESA> EMPRESA { get; set; }
        public DbSet<T_EMP_DIRECCION> EMP_DIRECCION { get; set; }
        public DbSet<T_EMP_CENTRO_COSTO> EMP_CENTRO_COSTO { get; set; }

        public MaintenanceMssqlDbContext(DbContextOptions<MaintenanceMssqlDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<T_ITEM_FAMILIA>().ToTable(Prefix + "T_ITEM_FAMILIA", Schema);
            builder.Entity<T_ITEM_FAMILIA>().HasKey(p => p.ifm_c_iid);
            builder.Entity<T_ITEM_FAMILIA>().Property(p => p.ifm_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_ITEM_SUB_FAMILIA>().ToTable(Prefix + "T_ITEM_SUB_FAMILIA", Schema);
            builder.Entity<T_ITEM_SUB_FAMILIA>().HasKey(p => p.isf_c_iid);
            builder.Entity<T_ITEM_SUB_FAMILIA>().Property(p => p.isf_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_SEGMENTO>().ToTable(Prefix + "T_SEGMENTO", Schema);
            builder.Entity<T_SEGMENTO>().HasKey(p => p.Segmento_c_yid);
            builder.Entity<T_SEGMENTO>().Property(p => p.Segmento_c_yid).ValueGeneratedOnAdd();

            builder.Entity<T_PRODUCTO_PARTIDA>().ToTable(Prefix + "T_PRODUCTO_PARTIDA", Schema);
            builder.Entity<T_PRODUCTO_PARTIDA>().HasKey(p => p.pro_partida_c_iid);
            builder.Entity<T_PRODUCTO_PARTIDA>().Property(p => p.pro_partida_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_UNIDAD_MEDIDA>().ToTable(Prefix + "T_UNIDAD_MEDIDA", Schema);
            builder.Entity<T_UNIDAD_MEDIDA>().HasKey(p => p.und_c_yid);
            //builder.Entity<T_UNIDAD_MEDIDA>().Property(p => p.und_c_yid).ValueGeneratedOnAdd();


            builder.Entity<T_ITEM>().ToTable(Prefix + "T_ITEM", Schema);
            builder.Entity<T_ITEM>().HasKey(p => p.itm_c_iid);
            builder.Entity<T_ITEM>().Property(p => p.itm_c_iid).ValueGeneratedOnAdd();


            //builder.Entity<T_ITEM_FAMILIA>().HasMany(p => p.T_ITEM_SUB_FAMILIAS).WithOne().HasForeignKey(c => c.isf_c_ifm_iid).HasPrincipalKey(p => p.ifm_c_iid);

            // builder.Entity<T_ITEM_SUB_FAMILIA>().HasOne(p => p.T_ITEM_FAMILIA).WithMany(b => b.T_ITEM_SUB_FAMILIAS).HasForeignKey(p => p.isf_c_ifm_iid).HasPrincipalKey(c => c.ifm_c_iid); 
            
            builder.Entity<T_ZONA_REPARTO>().ToTable(Prefix + "T_ZONA_REPARTO", Schema);
            builder.Entity<T_ZONA_REPARTO>().HasKey(p => p.zona_rep_c_yid);
            builder.Entity<T_ZONA_REPARTO>().Property(p => p.zona_rep_c_yid).ValueGeneratedOnAdd();

            builder.Entity<T_DEPARTAMENTO>().ToTable(Prefix + "T_DEPARTAMENTO", Schema);
            builder.Entity<T_DEPARTAMENTO>().HasKey(p => p.depa_c_ccod);

            builder.Entity<T_PROVINCIA>().ToTable(Prefix + "T_PROVINCIA", Schema);
            builder.Entity<T_PROVINCIA>().HasKey(p => p.prov_c_ccod);

            builder.Entity<T_DISTRITO>().ToTable(Prefix + "T_DISTRITO", Schema);
            builder.Entity<T_DISTRITO>().HasKey(p => p.dist_c_ccod_ubig);

            builder.Entity<T_CLI_CONTAC_CARGO>().ToTable(Prefix + "T_CLI_CONTAC_CARGO", Schema);
            builder.Entity<T_CLI_CONTAC_CARGO>().HasKey(p => p.cli_contac_cargo_c_yid);

            builder.Entity<T_CLI_CONTACTO>().ToTable(Prefix + "T_CLI_CONTACTO", Schema);
            builder.Entity<T_CLI_CONTACTO>().HasKey(p => p.cli_contac_c_iid);
            builder.Entity<T_CLI_CONTACTO>().Property(p => p.cli_contac_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_CLIENTE>().ToTable(Prefix + "T_CLIENTE", Schema);
            builder.Entity<T_CLIENTE>().HasKey(p => p.cli_c_vdoc_id);

            builder.Entity<T_NOMB_COM>().ToTable(Prefix + "T_NOMB_COM", Schema);
            builder.Entity<T_NOMB_COM>().HasKey(p => p.nomb_com_c_iid);
            builder.Entity<T_NOMB_COM>().Property(p => p.nomb_com_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_CLI_DIRECCION>().ToTable(Prefix + "T_CLI_DIRECCION", Schema);
            builder.Entity<T_CLI_DIRECCION>().HasKey(p => p.cli_direc_c_iid);
            builder.Entity<T_CLI_DIRECCION>().Property(p => p.cli_direc_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_EMPRESA>().ToTable(Prefix + "T_EMPRESA", Schema);
            builder.Entity<T_EMP_DIRECCION>().ToTable(Prefix + "T_EMP_DIRECCION", Schema);
            builder.Entity<T_EMP_CENTRO_COSTO>().ToTable(Prefix + "T_EMP_CENTRO_COSTO", Schema);

        }
        

        public override int SaveChanges()
        {
            UpdateAuditEntities();
            return base.SaveChanges();
        }
        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            UpdateAuditEntities();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(cancellationToken);
        }
        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void UpdateAuditEntities()
        {
            var modifiedEntries = ChangeTracker.Entries()
                .Where(x => x.Entity is IAuditableEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            foreach (var entry in modifiedEntries)
            {
                var entity = (IAuditableEntity)entry.Entity;
                DateTime now = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedDate = now;
                    entity.CreatedBy = CurrentUserId;
                }
                else
                {
                    base.Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                    base.Entry(entity).Property(x => x.CreatedDate).IsModified = false;
                }
                entity.UpdatedDate = now;
                entity.UpdatedBy = CurrentUserId;
            }
        }

    }
    public class ConfeccionMssqlDbContext : DbContext
    {
        public string Schema = "Confeccion";
        public string Prefix = "SIC_";
        public string CurrentUserId { get; set; }

        public DbSet<T_ESTILO> ESTILO { get; set; }
        public DbSet<T_TALLA> TALLA { get; set; }
        public DbSet<T_CATEGORIA> CATEGORIA { get; set; }
        public DbSet<T_COLOR> COLOR { get; set; }
        public DbSet<T_MARCA> MARCA { get; set; }
        public DbSet<T_MARCA_CATEGORIA> MARCA_CATEGORIA { get; set; }
        public DbSet<T_MARCA_COLOR> MARCA_COLOR { get; set; }
        public DbSet<T_ESTILO_TALLA> ESTILO_TALLA { get; set; }
        public DbSet<T_PROCESO> PROCESO { get; set; }
        public DbSet<T_ESTILO_PROCESO> ESTILO_PROCESO { get; set; }
        public DbSet<T_ESTILO_PROCESO_DETALLE> ESTILO_PROCESO_DETALLE { get; set; }

        public ConfeccionMssqlDbContext(DbContextOptions<ConfeccionMssqlDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
           
            builder.Entity<T_ESTILO>().ToTable(Prefix + "T_ESTILO", Schema);
            builder.Entity<T_ESTILO>().HasKey(p => new { p.estilo_c_iid });
            builder.Entity<T_ESTILO>().Property(p => p.estilo_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_TALLA>().ToTable(Prefix + "T_TALLA", Schema);
            builder.Entity<T_TALLA>().HasKey(p => new { p.talla_c_vid });

            builder.Entity<T_CATEGORIA>().ToTable(Prefix + "T_CATEGORIA", Schema);
            builder.Entity<T_CATEGORIA>().HasKey(p => new { p.categoria_c_vid });

            builder.Entity<T_COLOR>().ToTable(Prefix + "T_COLOR", Schema);
            builder.Entity<T_COLOR>().HasKey(p => new { p.color_c_vid });

            builder.Entity<T_MARCA>().ToTable(Prefix + "T_MARCA", Schema);
            builder.Entity<T_MARCA>().HasKey(p => new { p.marca_c_vid });

            builder.Entity<T_MARCA_CATEGORIA>().ToTable(Prefix + "T_MARCA_CATEGORIA", Schema);
            builder.Entity<T_MARCA_CATEGORIA>().HasKey(p => new { p.marca_categoria_c_vid });

            builder.Entity<T_MARCA_COLOR>().ToTable(Prefix + "T_MARCA_COLOR", Schema);
            builder.Entity<T_MARCA_COLOR>().HasKey(p => new { p.marca_color_c_vid });

            builder.Entity<T_ESTILO_TALLA>().ToTable(Prefix + "T_ESTILO_TALLA", Schema);
            builder.Entity<T_ESTILO_TALLA>().HasKey(p => new { p.estilo_talla_c_iid });
            builder.Entity<T_ESTILO_TALLA>().Property(p => p.estilo_talla_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_PROCESO>().ToTable(Prefix + "T_PROCESO", Schema);
            builder.Entity<T_PROCESO>().HasKey(p => new { p.proceso_c_vid });

            builder.Entity<T_ESTILO_PROCESO>().ToTable(Prefix + "T_ESTILO_PROCESO", Schema);
            builder.Entity<T_ESTILO_PROCESO>().HasKey(p => new { p.esti_proceso_c_iid });
            builder.Entity<T_ESTILO_PROCESO>().Property(p => p.esti_proceso_c_iid).ValueGeneratedOnAdd();

            builder.Entity<T_ESTILO_PROCESO_DETALLE>().ToTable(Prefix + "T_ESTILO_PROCESO_DETALLE", Schema);
            builder.Entity<T_ESTILO_PROCESO_DETALLE>().HasKey(p => new { p.esti_proc_detalle_c_iid });
            builder.Entity<T_ESTILO_PROCESO_DETALLE>().Property(p => p.esti_proc_detalle_c_iid).ValueGeneratedOnAdd();
            
        }

        public override int SaveChanges()
        {
            UpdateAuditEntities();
            return base.SaveChanges();
        }
        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            UpdateAuditEntities();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(cancellationToken);
        }
        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void UpdateAuditEntities()
        {
            var modifiedEntries = ChangeTracker.Entries()
                .Where(x => x.Entity is IAuditableEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            foreach (var entry in modifiedEntries)
            {
                var entity = (IAuditableEntity)entry.Entity;
                DateTime now = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedDate = now;
                    entity.CreatedBy = CurrentUserId;
                }
                else
                {
                    base.Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                    base.Entry(entity).Property(x => x.CreatedDate).IsModified = false;
                }
                entity.UpdatedDate = now;
                entity.UpdatedBy = CurrentUserId;
            }
        }

    }

}
