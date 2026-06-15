"use client";

import CircularGallery from "@/components/CircularGallery";

const ITEMS = [
  { image: "https://picsum.photos/seed/1/800/600", text: "Bridge" },
  { image: "https://picsum.photos/seed/2/800/600", text: "Desk Setup" },
  { image: "https://picsum.photos/seed/3/800/600", text: "Waterfall" },
  { image: "https://picsum.photos/seed/4/800/600", text: "Strawberries" },
  { image: "https://picsum.photos/seed/5/800/600", text: "Deep Diving" },
  { image: "https://picsum.photos/seed/6/800/600", text: "Train Track" },
  { image: "https://picsum.photos/seed/7/800/600", text: "Santorini" },
  { image: "https://picsum.photos/seed/8/800/600", text: "Blurry Lights" },
  { image: "https://picsum.photos/seed/9/800/600", text: "New York" },
  { image: "https://picsum.photos/seed/10/800/600", text: "Good Boy" },
  { image: "https://picsum.photos/seed/11/800/600", text: "Coastline" },
  { image: "https://picsum.photos/seed/12/800/600", text: "Palm Trees" },
];

export default function GalleryPage() {
  return (
    <div className="page-enter min-h-screen bg-[var(--color-bg)]">
      <div style={{ height: "100vh", position: "relative" }}>
        <CircularGallery
          items={ITEMS}
          bend={1}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.05}
          font="bold 30px Inter, sans-serif"
          scrollSpeed={2}
        />
      </div>
    </div>
  );
}
