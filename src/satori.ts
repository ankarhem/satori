import { RequestHandler } from "express";
import type { BootOptions } from "@jetshop/core/components/ConfigProvider";
import type { Product, Category } from "@jetshop/core/types";
import satori from "satori";
import { html } from "satori-html";

interface ResponseData {
  data: {
    route?: {
      object?:
        | Pick<
            Product,
            | "__typename"
            | "name"
            | "subName"
            | "price"
            | "previousPrice"
            | "campaigns"
            | "images"
          >
        | Pick<Category, "__typename" | "name" | "parent" | "images">;
    };
  };
  errors?: any[];
}

export const satoriHandler: RequestHandler = async (req, res) => {
  const { html: htmlString } = req.query;

  if (!htmlString || typeof htmlString !== "string") {
    res.status(400).send("Missing html");
    return;
  }

  const markup = html`<div
    style="display: flex; background: black; width: 25px; height: 25px"
  ></div>`;
  const svg = await satori(markup as any, {
    height: 400,
    width: 600,
    fonts: [],
  });

  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(svg);

  // const blob = new Blob([svg], { type: "image/svg+xml" });
  // const url = URL.createObjectURL(blob);

  // res.status(200).send(url);
};
