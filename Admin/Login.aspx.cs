using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_Login : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        errorMsg.Visible = false;
    }
    protected void btnLog_Click(Object sender, EventArgs e)
    {
        string pageOrigin = Request["p"] != null ? Request["p"] : "";
        adminLogin admLog = new adminLogin(usr.Value, pass.Value, pageOrigin);
        if (admLog.log)
        {
            if (pageOrigin != "")
            {
                Response.Redirect(pageOrigin);
            }
            else
            {
                Response.Redirect("default.aspx");
            }
        }
        else
        {
            //errorMsg.InnerText = "Usuario y/o Contraseña incorrecta";
            errorMsg.Visible = true;
        }
    }
}