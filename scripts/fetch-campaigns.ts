import fs from "fs/promises";
import path from "path";
import "dotenv/config";

const CONTENT_DIR = path.join(process.cwd(), "src/content");

interface Campaign {
  id: string;
  send_time: string;
  settings: {
    title: string;
    preview_text: string;
  };
  recipients: {
    list_id: string;
  };
}

async function fetchCampaignContent(
  campaignId: string,
  api_key: string,
  server_prefix: string
) {
  const auth_string = `apikey:${api_key}`;
  const auth_header = `Basic ${Buffer.from(auth_string).toString("base64")}`;

  const url = `https://${server_prefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: auth_header,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch content for campaign ${campaignId}: ${res.status} - ${res.statusText}`
    );
  }

  const data = await res.json();
  const bodyMatch = data.html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : data.html;
}

async function fetchAllCampaigns(
  api_key: string,
  server_prefix: string,
  list_id: string
) {
  let offset = 0;
  const count = 100;
  const allCampaigns = [];

  try {
    await fs.mkdir(CONTENT_DIR, { recursive: true });

    const auth_string = `apikey:${api_key}`;
    const auth_header = `Basic ${Buffer.from(auth_string).toString("base64")}`;

    while (true) {
      const url = `https://${server_prefix}.api.mailchimp.com/3.0/campaigns?count=${count}&offset=${offset}&status=sent`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: auth_header,
        },
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch campaigns: ${res.status} - ${res.statusText}`
        );
      }

      const data = await res.json();

      if (!data || !data.campaigns || data.campaigns.length === 0) {
        break;
      }

      console.log(
        `Fetched page with ${data.campaigns.length} campaigns. Total: ${data.total_items}`
      );

      const data_campaigns =
        api_key === process.env.MAILCHIMP_AM_API_KEY
          ? (data.campaigns as Campaign[]).filter(
              (c) => c.recipients.list_id === list_id
            )
          : data.campaigns;

      for (const campaign of data_campaigns) {
        console.log(`Processing campaign: ${campaign.settings.title}`);

        const doc = await fetchCampaignContent(
          campaign.id,
          api_key,
          server_prefix
        );

        console.log(campaign.settings);

        const slug = campaign.settings.title
          .toLowerCase()
          .match(/[a-z0-9]+/g)
          .join("-");

        const mdx = `---
title: "${campaign.settings.title
          .replace(/[“”]/g, '"')
          .replace(/[‘’]/g, "'")
          .replace(/"/g, "'")}"
slug: "${slug}"
date: ${new Date(campaign.send_time).getTime()}
description: "${campaign.settings.preview_text
          .replace(/[“”]/g, '"')
          .replace(/[‘’]/g, "'")
          .replace(/"/g, "'")}"
hidden: false
thumbnail_url: ""
web_exclusive: false
authors:
  - Tomo Chien
---

${doc}

`;

        const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
        await fs.writeFile(filePath, mdx);
        allCampaigns.push(campaign);
      }

      if (allCampaigns.length >= data.total_items) {
        break;
      }

      offset += count;
    }
  } catch (err) {
    console.error("Error fetching Mailchimp campaigns:", err);
  } finally {
    console.log(
      `Successfully fetched and saved ${allCampaigns.length} campaigns.`
    );
  }
}

fetchAllCampaigns(
  `${process.env.MAILCHIMP_MT_API_KEY}`,
  `${process.env.MAILCHIMP_MT_SERVER_PREFIX}`,
  "e82aaf3297"
);
fetchAllCampaigns(
  `${process.env.MAILCHIMP_AM_API_KEY}`,
  `${process.env.MAILCHIMP_AM_SERVER_PREFIX}`,
  "76280e1088"
);
