This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# SubProject Template

```json
{
  "name": "Subproject Name",
  "description": "Brief description of the subproject",
  "status": "Ongoing | Completed | Not yet started",
  "region": "Region Code",
  "province": "Province Name",
  "municipality": "Municipality/City Name",
  "barangay": "Barangay Name",
  "latitude": 0.000,
  "longitude": 0.000,
  "budget": 0.00,
  "abc": 0.00,
  "operating_unit": "Operating Unit Name",
  "year_funded": "YYYY",
  "stage": "Completed | Implementation | Procurement | Pre-Implementation",
  "contractor_name": "Contractor Name",
  "target_completion_date": "YYYY-MM-DDT00:00:00.000Z",
  "proposed_length": "0.0",
  "actual_length": "0.0",
  "design_length": "0.0",
  "quantity_unit": "km | m | ha",
  "psgc_code": "PSGC Code",
  "road_class": "Barangay Road | Provincial Road | National Road",
  "road_type": "Concrete | Asphalt | Earth Road",
  "start_date": "YYYY-MM-DDT00:00:00.000Z",
  "end_date": "YYYY-MM-DDT00:00:00.000Z",
  "calendar_days": "0",
  "fund_source": "Funding Agency",
  "commodities": [
    "Commodity 1",
    "Commodity 2"
  ],
  "metadata": {
    "geotag": [
      {
        "id": "photo-id",
        "url": "https://example.com/photo.jpg",
        "latitude": "0.0000",
        "longitude": "0.0000",
        "timestamp": "YYYY-MM-DDTHH:mm:ssZ",
        "category": "Validation | Progress | Completed"
      }
    ],
    "kml": "https://example.com/project.kml",
    "documents": [
      {
        "name": "Document Name",
        "attachment": "https://example.com/document.pdf"
      }
    ],
    "pow_details": [
      {
        "name": "Program of Works",
        "attachment": "https://example.com/pow.pdf",
        "date": "MM-DD-YYYY",
        "target": "0",
        "actual": "0"
      }
    ],
    "procurement_details": [
      {
        "name": "Procurement",
        "url": "https://example.com/procurement.pdf"
      }
    ]
  }
}
