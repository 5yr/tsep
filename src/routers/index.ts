import * as api from "./api";

export const register = (app: any) => {
  // define a route handler for the default home page
  app.get("/", (req: any, res: any) => {

    if (req.session.site !== undefined) {
      // tslint:disable-next-line:no-console
      console.log(req.session.site);
    }

    // 设置Session
    req.session.site = {name: "xxx", domain: "bbb"};

    // render the index template
    res.render("index");
  });

  api.register(app);
};
