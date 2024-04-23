const Product = require("../../../Product-Service/src/models/Product");
const proxy = require("../proxy");
const ServiceRegistryClient = require("../utils/serviceRegistry");
const {extractSellerId,extractToken,verifySeller} = require("../utils/middleware");

ProductRouter.get("/all", async (request, response, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl("Product");
    const targetUrl = new URL("/api/product/all", baseUrl).toString();
    await proxy(request, response, targetUrl);
  } catch (error) {
    next(error);
  }
});

ProductRouter.get("/:id", async (request, response, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl("Product");
    const targetUrl = new URL(
      `/api/product/${request.params.id}`,
      baseUrl
    ).toString();
    await proxy(request, response, targetUrl);
  } catch (error) {
    next(error);
  }
});

ProductRouter.post(
  "/add",
  extractToken,
  verifySeller,
  extractSellerId,
  async (request, response, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl("Product");
      const targetUrl = new URL("/api/product/add", baseUrl).toString();
      await proxy(request, response, targetUrl);
    } catch (error) {
      next(error);
    }
  }
);

ProductRouter.put("/update/:id", async (request, response, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl("Product");
    const targetUrl = new URL(
      `/api/product/update/${request.params.id}`,
      baseUrl
    ).toString();
    await proxy(request, response, targetUrl);
  } catch (error) {
    next(error);
  }
});

ProductRouter.delete("/remove/:id", async (request, response, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl("Product");
    const targetUrl = new URL(
      `/api/product/remove/${request.params.id}`,
      baseUrl
    ).toString();
    await proxy(request, response, targetUrl);
  } catch (error) {
    next(error);
  }
});

ProductRouter.get("/filter/:category", async (request, response, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl("Product");
    const targetUrl = new URL(
      `/api/product/filter/${request.params.category}`,
      baseUrl
    ).toString();
    await proxy(request, response, targetUrl);
  } catch (error) {
    next(error);
  }
});

ProductRouter.put("/buy/:id", async (request, response, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl("Product");
    const targetUrl = new URL(
      `/api/product/buy/${request.params.id}`,
      baseUrl
    ).toString();
    await proxy(request, response, targetUrl);
  } catch (error) {
    next(error);
  }
});

ProductRouter.put("/refund/:id", async (request, response, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl("Product");
    const targetUrl = new URL(
      `/api/product/refund/${request.params.id}`,
      baseUrl
    ).toString();
    await proxy(request, response, targetUrl);
  } catch (error) {
    next(error);
  }
});
