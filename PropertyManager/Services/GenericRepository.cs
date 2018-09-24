using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using PropertyManager.Models;

namespace PropertyManager.Services
{
    public class GenericRepository<T> where T : class
    {
        internal PropertyManagerEntities context;
        internal DbSet<T> dbSet;

        public GenericRepository(PropertyManagerEntities context)
        {
            this.context = context;
            this.dbSet = context.Set<T>();
        }

        public virtual IQueryable<T> FindBy(Expression<Func<T, bool>> predicate)
        {
            return dbSet.Where(predicate);
        }

        public virtual IQueryable<T> GetAll()
        {
            return dbSet;
        }

        public virtual void Save(T entity)
        {
            dbSet.AddOrUpdate(entity);
            Save();
        }

        //public virtual void Update(T entity)
        //{
        //    dbSet.Attach(entity);
        //    context.Entry(entity).State = EntityState.Modified;
        //    Save();
        //}

        public virtual void Save()
        {
            context.SaveChanges();
        }

        public virtual void Delete(object id)
        {
            T entity = dbSet.Find(id);
            Delete(entity);
        }

        public virtual void Delete(T entity)
        {
            if (context.Entry(entity).State == EntityState.Detached)
            {
                dbSet.Attach(entity);
            }

            dbSet.Remove(entity);
            Save();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (context != null)
                {
                    context.Dispose();
                    context = null;
                }
            }
        }
    }
}