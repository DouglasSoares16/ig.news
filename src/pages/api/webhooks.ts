import { NextApiResponse, NextApiRequest } from "next";

export default function webhook(
  request: NextApiRequest, 
  response: NextApiResponse
) {
  console.log("teste evento");

  response.status(200).json({ ok: true });
}