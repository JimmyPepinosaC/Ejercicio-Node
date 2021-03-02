const fs = require("fs");
const http = require("http");
const axios = require("axios");

const urlProveedores =
  "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
const urlClientes =
  "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";

const jsonProveedores = async function makeGetRequestProveedores() {
  let res = await axios.get(urlProveedores);

  let data = res.data;
  return data;
};

const jsonClientes = async function makeGetRequestClientes() {
  let res = await axios.get(urlClientes);

  let data = res.data;
  return data;
};

const servidor = http.createServer(async function (req, res) {
  console.log("Hello world");

  let tabla = fs.readFileSync("tablas.html", { encoding: "utf-8", flag: "r" });

  if (req.url == "/api/proveedores") {
    console.log("Hello proveedores");
    res.writeHead(200, { "Content-Type": "text/html" });

    let head = `
        <th scope="col">ID</th>
        <th scope="col">Nombre</th>
        <th scope="col">Contacto</th> 
        `;

    tabla = tabla
      .replace("{{titulo}}", "Lista proveedores")
      .replace("{{head}}", head);

    json = await jsonProveedores();
    let rows = "";

    for (let i = 0; i < json.length; i++) {
      let proveedor = json[i];
      rows += `
            <tr>
            <td> ${proveedor.idproveedor}</td> <td>${proveedor.nombrecompania}</td> <td>${proveedor.nombrecontacto}</td>
            </tr>`;
    }

    tabla = tabla.replace("{{rows}}", rows);

    fs.writeFileSync("tablaProveedores.html", tabla);
    fs.createReadStream("tablaProveedores.html").pipe(res);
    fs.unlinkSync("tablaProveedores.html");
  } else if (req.url == "/api/clientes") {
    console.log("Hello Clientes");
    res.writeHead(200, { "Content-Type": "text/html" });

    let head = `
        <th scope="col">ID</th>
        <th scope="col">Nombre Compañia</th>
        <th scope="col">Contacto</th> 
        `;

    tabla = tabla
      .replace("{{titulo}}", "Lista Clientes")
      .replace("{{head}}", head);

    json = await jsonClientes();
    let rows = "";

    for (let i = 0; i < json.length; i++) {
      let cliente = json[i];
      rows += `
            <tr>
            <td> ${cliente.idCliente}</td> <td>${cliente.NombreCompania}</td> <td>${cliente.NombreContacto}</td>
            </tr>`;
    }

    tabla = tabla.replace("{{rows}}", rows);

    fs.writeFileSync("tablaClientes.html", tabla);
    fs.createReadStream("tablaClientes.html").pipe(res);
    fs.unlinkSync("tablaClientes.html");
  } else {
    fs.createReadStream("index.html").pipe(res);
  }
});

servidor.listen(process.env.PORT || 8081);
