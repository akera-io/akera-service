using System;
using System.ServiceProcess;
using System.Diagnostics;
using System.IO;
using System.Xml;
using System.Configuration.Install;

namespace Io.Akera.Service
{
    class Control
    {

        enum ExitCode : int
        {
            Success = 0,
            InvalidArguments = 1,
            InvalidCommand = 2,
            ConfigFileNotFound = 3,
            InvalidConfig = 4,
            InvalidServiceName = 5,
            InvalidServiceCommand = 6
        }

        static int Main(string[] args)
        {

            String binFile = new Uri(System.Reflection.Assembly.GetExecutingAssembly().CodeBase).LocalPath;

            try
            {
                ServiceInfo svc = ReadServiceInfo(binFile + ".xml");

                if (svc.Name == null || svc.Name.Trim().Length == 0)
                {
                    System.Console.Error.WriteLine("Invalid service name, this must be set in configuration xml file <name>.");
                    return (int)ExitCode.InvalidServiceName;
                }

                if (svc.StartCommand == null || svc.StartCommand.Trim().Length == 0)
                {
                    System.Console.Error.WriteLine("Invalid service start command, this must be set in configuration xml file <startCommand>.");
                    return (int)ExitCode.InvalidServiceCommand;
                }

                if (args.Length == 0)
                    ServiceBase.Run(new ServiceImpl(svc));
                else
                {
                    string cmd = args[0].ToLower();

                    if (cmd.Equals("install") || cmd.Equals("uninstall"))
                    {

                        if (cmd.Equals("install"))
                        {
                            if (args.Length > 5)
                            {
                                System.Console.Error.WriteLine("Invalid install options, use: install [-u account] [-p password].");
                                return (int)ExitCode.InvalidArguments;
                            }

                            string account = null;
                            string passwd = null;

                            for (int i = 1; i < args.Length; i++)
                            {
                                if (args[i].Equals("-u", StringComparison.InvariantCultureIgnoreCase))
                                    account = args[++i];
                                if (args[i].Equals("-p", StringComparison.InvariantCultureIgnoreCase))
                                    passwd = args[++i];

                            }
                            Install(binFile, svc, account, passwd);
                        }
                        else
                        {
                            if (args.Length > 1)
                            {
                                System.Console.Error.WriteLine("Invalid uninstall options, command doesn't take any parameters.");
                                return (int)ExitCode.InvalidArguments;
                            }

                            UnInstall(svc);
                        }

                    }
                    else
                    {
                        System.Console.Error.WriteLine("Invalid command, valid options: install/uninstall.");
                        return (int)ExitCode.InvalidCommand;
                    }
                }

                return (int)ExitCode.Success;
            }
            catch (FileNotFoundException e)
            {
                System.Console.Error.WriteLine(e.Message);
                return (int)ExitCode.ConfigFileNotFound;
            }
            catch (Exception e)
            {
                System.Console.Error.WriteLine(e.Message);
                return (int)ExitCode.InvalidConfig;
            }


        }

        static ServiceInfo ReadServiceInfo(string configFile)
        {

            XmlTextReader xmlReader = new XmlTextReader(configFile);
            string xmlNode = null;
            string xmlVal = "";
            ServiceInfo svc = new ServiceInfo();

            while (xmlReader.Read())
            {
                switch (xmlReader.NodeType)
                {
                    case XmlNodeType.Element:
                        xmlNode = xmlReader.Name;
                        xmlVal = "";
                        break;
                    case XmlNodeType.Text:
                        xmlVal = xmlVal + xmlReader.Value;
                        break;
                    case XmlNodeType.EndElement:
                        svc.SetProperty(xmlNode, xmlVal);
                        break;

                }
            }

            xmlReader.Close();

            return svc;

        }

        static private ServiceAccount GetAccount(string account)
        {

            if (account == null || account.Trim().Length == 0)
                return ServiceAccount.LocalService;

            try
            {
                return (ServiceAccount)System.Enum.Parse(typeof(ServiceAccount), account, true);
            }
            catch (Exception)
            {
                return ServiceAccount.User;
            }

        }

        static void Install(string binFile, ServiceInfo svc, string account, string password)
        {
            ServiceProcessInstaller ProcessInstaller = new ServiceProcessInstaller();
            ProcessInstaller.Account = GetAccount(account);

            if (ProcessInstaller.Account.Equals(ServiceAccount.User) && password != null)
            {
                if (account.IndexOf("\\") == -1 && System.Environment.UserDomainName != null)
                    account = System.Environment.UserDomainName + "\\" + account;

                System.Console.Out.WriteLine(String.Format("Install service to run as user account: {0}.", account));
                ProcessInstaller.Username = account;
                ProcessInstaller.Password = password;
            }
            else
            {
                System.Console.Out.WriteLine(String.Format("Install service to run as system account: {0}.", ProcessInstaller.Account.ToString()));
            }

            ServiceInstaller SINST = new ServiceInstaller();
            InstallContext Context = new InstallContext();
            Context.Parameters.Add("assemblyPath", binFile);

            SINST.Context = Context;
            SINST.DisplayName = svc.Name;
            SINST.Description = svc.Description;
            SINST.ServiceName = svc.Name;
            SINST.StartType = svc.GetStartMode();
            SINST.Parent = ProcessInstaller;

            System.Collections.Specialized.ListDictionary state = new System.Collections.Specialized.ListDictionary();
            SINST.Install(state);
        }


        static void UnInstall(ServiceInfo svc)
        {
            ServiceInstaller SINST = new ServiceInstaller();

            InstallContext Context = new InstallContext();
            SINST.Context = Context;
            SINST.ServiceName = svc.Name;
            SINST.Uninstall(null);
        }


    }
}
