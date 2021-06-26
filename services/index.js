module.exports = async (app) => {
   app.sub("/api", async (app) => {
      app.get("/home", async (req, res) => {
         const data = await JSON.stringify({
            news: "<b>Malina.js</b> builds your web-application to use it without framework on frontend side. Therefore your web-app becomes thinner and faster, and the application itself consist of <b>vanilla JavaScript</b>",
         });
         res.send(data);
      });
   });
};
