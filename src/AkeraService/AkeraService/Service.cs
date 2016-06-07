using System;
using System.Diagnostics;

namespace Io.Akera.Service
{
    class ServiceImpl : System.ServiceProcess.ServiceBase
    {
        private ServiceInfo svc = null;
        private Process proc = null;

        public ServiceImpl(ServiceInfo svc)
        {
            this.CanPauseAndContinue = false;
            this.CanStop = true;
            this.CanShutdown = true;
            this.AutoLog = true;
            this.svc = svc;

        }

        protected override
        void OnStart(string[] args)
        {
            this.EventLog.Source = svc.Name;
                    
            if (svc.StartCommand == null || svc.StartCommand.Trim().Length == 0)
            {
                this.EventLog.WriteEntry("Invalid service command.", EventLogEntryType.Error);
                this.ExitCode = -1;
            }
            else
            {
                proc = Process.Start(svc.StartCommand, svc.StartArguments);

                this.EventLog.WriteEntry(String.Format("Service command started with pid {0}.", proc.Id), EventLogEntryType.Information);
                
            }
        }

        protected override void OnStop()
        {
            if (proc != null && !proc.HasExited)
            {

                if (svc.StopCommand != null && svc.StopCommand.Trim().Length > 0)
                {
                    Process stopProc = Process.Start(svc.StopCommand, svc.StopArguments);

                    this.EventLog.WriteEntry(String.Format("Service command stop attempt for {0}.", proc.Id), EventLogEntryType.Information);

                    if (!stopProc.WaitForExit(10000))
                    {
                        this.EventLog.WriteEntry(String.Format("Service command stop process killed with {0}.", stopProc.Id), EventLogEntryType.Warning);
                        stopProc.Kill();
                    }

                    if (proc.HasExited || proc.WaitForExit(10000))
                        return;

                }

                this.EventLog.WriteEntry(String.Format("Service command process killed with {0}.", proc.Id), EventLogEntryType.Warning);
                proc.Kill();
            }
        }

        protected override void OnShutdown()
        {
            this.OnStop();
        }



    }
}