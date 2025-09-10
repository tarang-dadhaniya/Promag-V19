import { RequestHandler } from "express";
import { DemoResponse } from "@shared/api";
import { getRequestT } from "../i18n";

export const handleDemo: RequestHandler = (req, res) => {
  const t = getRequestT(req);
  const response: DemoResponse = {
    message: t("api.demoMessage"),
  };
  res.status(200).json(response);
};
