﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PropertyManager.Models;

namespace PropertyManager.Services
{
    public partial class Service
    {
        private GenericRepository<project> _projectRepository;
        public GenericRepository<project> ProjectRepository
        {
            get
            {
                if (this._projectRepository == null)
                    this._projectRepository = new GenericRepository<project>(_context);
                return _projectRepository;
            }
        }

        private GenericRepository<project_content> _projectContentRepository;
        public GenericRepository<project_content> ProjectContentRepository
        {
            get
            {
                if (this._projectContentRepository == null)
                    this._projectContentRepository = new GenericRepository<project_content>(_context);
                return _projectContentRepository;
            }
        }


        public project GetProjectByName(string name)
        {
            return ProjectRepository.FindBy(p => p.project_content.Any(q => q.name.ToLower() == name.ToLower()))
                .FirstOrDefault();
        }

        public void SaveProject(project project)
        {
            ProjectRepository.Save(project);
        }

        public void SaveProjectContent(project_content content)
        {
            ProjectContentRepository.Save(content);
        }
    }
}