import type { Metadata } from "next";
import TrainerProfileClient from "./client";

interface TrainerData {
  id: number;
  slug: string;
  name: string;
  email: string;
  avatar_url: string | null;
  photo_url: string | null;
  cover_photo_url: string | null;
  verified: boolean;
  bio: string;
  experience_years: number;
  specialisations: string[];
  session_types: string[];
  certifications: string[];
  hourly_rate: number;
  home_suburb: string;
  state: string;
  avg_rating: number;
  review_count: number;
  gallery: string[];
  created_at: string;
  session_pricing: { type: string; price: number; duration: number; description: string }[];
  reviews: {
    id: number;
    client_name: string;
    rating: number;
    comment: string;
    trainer_reply: string | null;
    created_at: string;
  }[];
  availability: {
    id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    locationType: string;
  }[];
}

async function getTrainer(slug: string): Promise<TrainerData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/trainers/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.trainer || data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trainer = await getTrainer(slug);

  if (!trainer) {
    return {
      title: "Trainer Not Found",
    };
  }

  return {
    title: `${trainer.name} - Personal Trainer in ${trainer.home_suburb}, ${trainer.state}`,
    description: `Book ${trainer.name}, a verified personal trainer in ${trainer.home_suburb}, ${trainer.state}. Specialising in ${trainer.specialisations?.slice(0, 3).join(", ")}. From $${trainer.hourly_rate}/hr.`,
    openGraph: {
      title: `${trainer.name} - Personal Trainer | AnywherePT`,
      description: trainer.bio?.slice(0, 160) || "",
      images: trainer.avatar_url ? [{ url: trainer.avatar_url }] : [],
    },
  };
}

export default async function TrainerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trainer = await getTrainer(slug);

  if (!trainer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-warm-900">Trainer Not Found</h1>
          <p className="mt-2 text-warm-500">The trainer profile you are looking for does not exist.</p>
          <a href="/trainers" className="mt-6 inline-block rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
            Browse Trainers
          </a>
        </div>
      </div>
    );
  }

  return <TrainerProfileClient trainer={trainer} />;
}
