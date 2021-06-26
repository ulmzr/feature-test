require("dotenv").config();

const path = require("path");
const { build } = require("esbuild");
const { derver, createRemote } = require("derver");
const { malinaPlugin } = require("malinajs/malina-esbuild");

const DEV = process.argv.includes("--dev");

const host = DEV ? "localhost" : "0.0.0.0";
const port = process.env.PORT ? process.env.PORT : 7000;
const watch = DEV ? ["public", "src", "services"] : false;
const compress = DEV ? true : false;
const dir = path.join(__dirname, "public");
const spa = true;
const css = process.env.CSSINJS ? true : false;

const remote =
   DEV &&
   createRemote({
      host,
      port,
   });

const app = derver({
   spa,
   host,
   dir,
   port,
   watch,
   compress,
   remote: "fullstack",
   onwatch: async (livereload, watchitem, filename, eventname) => {
      if (watchitem == "src") {
         const bundleClient = await build_client();
         try {
            await bundleClient.rebuild();
         } catch (err) {
            remote.error(err.message, "Malina compile error");
         }
      }
      if (watchitem == "services") {
         try {
            // Still waiting new derver feature to reload it self
            remote.reload();
         } catch (err) {
            remote.error(err.message, "Malina compile error");
         }
      }
   },
});

const services = require("./services")(app);
app.use(services);

async function build_client() {
   return await build({
      entryPoints: ["src/main.js"],
      bundle: true,
      outdir: "public",
      format: "esm",
      sourcemap: DEV,
      minify: !DEV,
      incremental: DEV,
      plugins: [malinaPlugin({ css })],
   });
}
