using System;
using System.ServiceProcess;

namespace Io.Akera.Service
{
    class ServiceInfo
    {
        public string Name;

        public string Description;

        public string StartCommand;

        public string StartArguments;

        public string StopCommand;

        public string StopArguments;

        public string StartMode;

        public ServiceStartMode GetStartMode()
        {
            try
            {
                return (ServiceStartMode)System.Enum.Parse(typeof(ServiceStartMode), StartMode, true);
            }
            catch (Exception)
            {
                return ServiceStartMode.Manual;
            }

        }

        public void SetProperty(string name, string value)
        {
            switch (name.ToLower())
            {
                case "name":
                    this.Name = value;
                    break;
                case "description":
                    this.Description = value;
                    break;
                case "startcommand":
                case "startscript":
                    this.StartCommand = value;
                    break;
                case "startarguments":
                    this.StartArguments = value;
                    break;
                case "stopcommand":
                case "stopscript":
                    this.StopCommand = value;
                    break;
                case "stoparguments":
                    this.StopArguments = value;
                    break;
                case "startup":
                    this.StartMode = value;
                    break;
            }
        }

    }
}
