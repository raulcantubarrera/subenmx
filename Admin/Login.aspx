<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Login.aspx.cs" Inherits="Admin_Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style>
        body {
            background: url("/img/backgrounds/free-backgrounds-17.jpg");
            text-align: center;
            font-family:sans-serif;
        }
        form {
            text-align:center;
        }
        input[type=text],input[type=password] {
            background-color:#eee;
            border: 0 solid transparent;
            border-radius: 3px;
            color: #1d1d1b;
            display: table-cell;
            font-size: 20px;
            padding: 10px;
        }
        .box {
        }
        .row {
            margin-bottom: 15px;
        }
        .logBox {
             background-color: tomato;
            border-color: gray;
            border-radius: 3px;
            border-style: solid;
            border-width: 0 0 1px;
            display: inline-table;
            padding: 70px 20px;
        }
            .logBox img {
                background-color: lightskyblue;
                border-radius: 3px;
                display: table-cell;
                height: 40px;
                padding: 3px;
            }
        .inputLogin {
             background-color: #eee;
             border-radius: 3px;
             display: inline-flex;
             padding:6px;
        }
        ul {
            list-style:none;
        }
        input[type=submit] {
            background-color: #eee;
            border-color: lightskyblue;
            border-radius: 3px;
            border-style: solid;
            border-width: 0 0 3px;
            color: tomato;
            cursor: pointer;
            font-size: 20px;
            padding:15px;
            width:100%;
        }
            input[type=submit]:hover {
                border-color: #1d1d1b;
                background-color: lightskyblue;
                color:#1D1D1B;
            }
        #errorMsg {
            font-size:20px;
            color:#eee;
            text-align:center;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <ul class="box logBox">
            <li class="row">
                <div class="inputLogin">
                    <span style="display:none;">Usuario</span>
                    <img src="/img/login/user.png" />
                    <input type="text" runat="server" id="usr" maxlength="10" />
                </div>
            </li>
            <li class="row">
                <div class="inputLogin">
                    <span style="display:none;">Contraseña</span>
                    <img src="/img/login/password.png" />
                    <input type="password" runat="server" id="pass" maxlength="10" />
                </div>
            </li>
            <li class="row">
                <asp:Button runat="server" id="btnLog" OnClick="btnLog_Click" Text="Entrar" />
            </li>
            <li class="row">
                <span id="errorMsg" runat="server">Usuario y/o contraseña <br />incorrecta</span>
            </li>
        </ul>
    </form>
</body>
</html>
