import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import {
  Home as HomeIcon,
  Users,
  Calendar,
  Sparkles,
  User,
  Bell,
  MessageCircle,
  MapPin,
  Search,
  ChevronLeft,
  Heart,
  Bookmark,
  Scissors,
  Stethoscope,
  GraduationCap,
  ShoppingBag,
  PawPrint,
  Send,
  Check,
  X,
} from "lucide-react";

import logo from "@/assets/logo.png";
import tommy from "@/assets/tommy.jpg";
import mimi from "@/assets/mimi.jpg";
import snowy from "@/assets/snowy.jpg";
import luna from "@/assets/luna.jpg";
import community from "@/assets/community.jpg";
import mapImg from "@/assets/map.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AniBuddy — Find Your Pack" },
      {
        name: "description",
        content:
          "AniBuddy is Dhaka's pet lifestyle, social and community platform. Find walk friends, events, and services for your pet.",
      },
      { property: "og:title", content: "AniBuddy — Find Your Pack" },
      {
        property: "og:description",
        content: "AniBuddy is Dhaka's pet lifestyle, social and community platform. Find walk friends, events, and services for your pet.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AniBuddyApp,
});

type Screen =
  | "home"
  | "friends"
  | "profile-pet"
  | "notifications"
  | "events"
  | "services"
  | "profile"
  | "request-sent";

type Pet = {
  id: string;
  name: string;
  age: string;
  breed: string;
  gender: "Male" | "Female";
  distance: string;
  location: string;
  tags: string[];
  interests: string[];
  owner: string;
  availability: string;
  photo: string;
};

const PETS: Pet[] = [
  {
    id: "tommy",
    name: "Tommy",
    age: "2 months",
    breed: "Deshi puppy",
    gender: "Male",
    distance: "0.6 km",
    location: "Dhanmondi 27, Dhaka",
    tags: ["Playful", "Curious", "Friendly"],
    interests: ["Morning walks", "Fetch", "Meeting new pups"],
    owner: "Rafiul H.",
    availability: "Weekdays after 5 PM · Weekends AM",
    photo: tommy,
  },
  {
    id: "mimi",
    name: "Mimi",
    age: "3 months",
    breed: "Persian mix kitten",
    gender: "Female",
    distance: "1.1 km",
    location: "Mohammadpur, Dhaka",
    tags: ["Cuddly", "Shy", "Indoor"],
    interests: ["Naps", "Feather toys", "Sunbathing"],
    owner: "Nusrat J.",
    availability: "Playdates on weekends",
    photo: mimi,
  },
  {
    id: "snowy",
    name: "Snowy",
    age: "2 months",
    breed: "Persian kitten",
    gender: "Female",
    distance: "1.4 km",
    location: "Gulshan 2, Dhaka",
    tags: ["Gentle", "Fluffy", "Quiet"],
    interests: ["Grooming", "String toys"],
    owner: "Sadia K.",
    availability: "Weekends only",
    photo: snowy,
  },
  {
    id: "luna",
    name: "Luna",
    age: "3 months",
    breed: "Persian mix kitten",
    gender: "Female",
    distance: "2.2 km",
    location: "Banani, Dhaka",
    tags: ["Curious", "Bold", "Chatty"],
    interests: ["Window watching", "Chasing"],
    owner: "Tanvir R.",
    availability: "Evenings",
    photo: luna,
  },
];

function AniBuddyApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activePet, setActivePet] = useState<Pet>(PETS[0]);
  const [walkModalOpen, setWalkModalOpen] = useState(false);
  const [savedServices, setSavedServices] = useState<string[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);

  const go = (s: Screen) => setScreen(s);

  const openPet = (pet: Pet) => {
    setActivePet(pet);
    setScreen("profile-pet");
  };

  const submitWalk = () => {
    setWalkModalOpen(false);
    toast.success("Walk invitation sent");
    setScreen("request-sent");
  };

  const joinEvent = (id: string, name: string) => {
    if (joinedEvents.includes(id)) return;
    setJoinedEvents((v) => [...v, id]);
    toast.success(`Joined ${name}`);
  };

  const saveService = (id: string, name: string) => {
    if (savedServices.includes(id)) {
      setSavedServices((v) => v.filter((x) => x !== id));
      toast(`Removed ${name} from saved`);
    } else {
      setSavedServices((v) => [...v, id]);
      toast.success(`Offer saved · ${name}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--blush)]/60 flex justify-center">
      <Toaster position="top-center" richColors />
      <div className="relative w-full max-w-[430px] min-h-screen bg-background shadow-sm overflow-hidden">
        {/* Status/top spacing */}
        <div className="pb-24">
          {screen === "home" && <HomeScreen go={go} openPet={openPet} />}
          {screen === "friends" && <FriendsScreen go={go} openPet={openPet} />}
          {screen === "profile-pet" && (
            <PetProfileScreen
              pet={activePet}
              go={go}
              onInvite={() => setWalkModalOpen(true)}
            />
          )}
          {screen === "notifications" && <NotificationsScreen go={go} />}
          {screen === "events" && (
            <EventsScreen
              go={go}
              joined={joinedEvents}
              onJoin={joinEvent}
            />
          )}
          {screen === "services" && (
            <ServicesScreen
              go={go}
              saved={savedServices}
              onSave={saveService}
            />
          )}
          {screen === "profile" && (
            <ProfileScreen
              go={go}
              savedCount={savedServices.length}
              joinedCount={joinedEvents.length}
            />
          )}
          {screen === "request-sent" && (
            <RequestSentScreen pet={activePet} go={go} />
          )}
        </div>

        {/* Bottom Nav */}
        <BottomNav screen={screen} go={go} />

        {/* Walk request modal */}
        {walkModalOpen && (
          <WalkRequestModal
            pet={activePet}
            onClose={() => setWalkModalOpen(false)}
            onSubmit={submitWalk}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------- Shared UI ---------------- */

function TopBar({
  title,
  onBack,
  right,
}: {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-3">
      <div className="flex items-center gap-2 min-w-0">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Back"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--blush)] text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {title && (
          <h1 className="truncate text-lg font-semibold">{title}</h1>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">{right}</div>
    </div>
  );
}

function Logo({ size = 32 }: { size?: number }) {
  return (
    <img
      src={logo}
      alt="AniBuddy logo"
      width={size}
      height={size}
      className="rounded-lg"
    />
  );
}

function BottomNav({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  const items: { key: Screen; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Home", icon: <HomeIcon className="h-5 w-5" /> },
    { key: "friends", label: "Friends", icon: <Users className="h-5 w-5" /> },
    { key: "events", label: "Events", icon: <Calendar className="h-5 w-5" /> },
    { key: "services", label: "Services", icon: <Sparkles className="h-5 w-5" /> },
    { key: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
  ];
  const isActive = (k: Screen) => {
    if (k === "friends") return screen === "friends" || screen === "profile-pet" || screen === "request-sent";
    return screen === k;
  };
  return (
    <nav className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur px-2 pt-2 pb-3">
      <ul className="grid grid-cols-5 gap-1">
        {items.map((it) => {
          const active = isActive(it.key);
          return (
            <li key={it.key}>
              <button
                onClick={() => go(it.key)}
                className={`flex w-full flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[11px] transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full ${
                    active ? "bg-[var(--rose-light)]" : ""
                  }`}
                >
                  {it.icon}
                </span>
                <span className="font-medium">{it.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Pill({
  children,
  tone = "blush",
}: {
  children: React.ReactNode;
  tone?: "blush" | "rose" | "outline";
}) {
  const cls =
    tone === "rose"
      ? "bg-[var(--rose-light)] text-[color:var(--rose-deep)]"
      : tone === "outline"
      ? "border border-border text-foreground"
      : "bg-[var(--blush)] text-foreground";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${cls}`}>
      {children}
    </span>
  );
}

/* ---------------- Home ---------------- */

function HomeScreen({
  go,
  openPet,
}: {
  go: (s: Screen) => void;
  openPet: (p: Pet) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-3 min-w-0">
          <Logo size={40} />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Hi,</p>
            <h1 className="truncate text-lg font-semibold">Farah 👋</h1>
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3" /> Dhaka, Bangladesh
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <IconBtn onClick={() => go("notifications")} label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
          </IconBtn>
          <IconBtn onClick={() => toast("Messages coming soon")} label="Messages">
            <MessageCircle className="h-5 w-5" />
          </IconBtn>
        </div>
      </div>

      {/* Find My Friend card */}
      <div className="mx-5 mt-5 rounded-3xl bg-[var(--rose-light)] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-[color:var(--rose-deep)]">
              Find My Friend
            </p>
            <h2 className="mt-1 text-xl font-bold leading-tight">
              Find a walk buddy<br />for your pet today
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Pets nearby are looking for playmates.
            </p>
          </div>
          <PawPrint className="h-10 w-10 text-[color:var(--rose-deep)] shrink-0" />
        </div>
        <button
          onClick={() => go("friends")}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground active:opacity-90"
        >
          <Search className="h-4 w-4" /> Find Pets Nearby
        </button>
      </div>

      {/* Shortcuts */}
      <div className="mt-6 px-5">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Community", icon: <Users className="h-5 w-5" />, s: "friends" as Screen },
            { label: "Events", icon: <Calendar className="h-5 w-5" />, s: "events" as Screen },
            { label: "Services", icon: <Sparkles className="h-5 w-5" />, s: "services" as Screen },
            { label: "Challenges", icon: <Heart className="h-5 w-5" />, s: "home" as Screen },
          ].map((it) => (
            <button
              key={it.label}
              onClick={() => {
                if (it.label === "Challenges") toast("New weekly challenge coming soon");
                else go(it.s);
              }}
              className="flex flex-col items-center gap-2"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--blush)] text-[color:var(--rose-deep)]">
                {it.icon}
              </span>
              <span className="text-[11px] font-medium">{it.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Pet Content */}
      <section className="mt-6">
        <SectionHead title="Trending Pet Content" action="See all" onAction={() => toast("Feed coming soon")} />
        <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
          {[
            { img: tommy, title: "Tommy's first monsoon walk", who: "Rafiul H." },
            { img: mimi, title: "Mimi discovers a feather", who: "Nusrat J." },
            { img: snowy, title: "Snowy's grooming day", who: "Sadia K." },
          ].map((c) => (
            <div key={c.title} className="w-52 shrink-0 rounded-2xl border border-border bg-card overflow-hidden">
              <img src={c.img} alt={c.title} loading="lazy" className="h-32 w-full object-cover" />
              <div className="p-3">
                <p className="text-sm font-semibold leading-tight">{c.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">by {c.who}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Events */}
      <section className="mt-4">
        <SectionHead title="Nearby Events" action="View all" onAction={() => go("events")} />
        <div className="mt-3 space-y-3 px-5">
          <EventRow title="Pet Walk · Suhrawardy Udyan" when="Fri · 6:30 AM" attending={42} />
          <EventRow title="Playdate · Gulshan Lake Park" when="Sat · 4:00 PM" attending={28} />
        </div>
      </section>

      {/* Community highlight */}
      <section className="mt-6 px-5">
        <SectionHead title="Community Highlight" inline />
        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
          <img src={community} alt="Community pet of the week" loading="lazy" className="h-40 w-full object-cover" />
          <div className="p-4">
            <div className="flex items-center gap-3">
              <img src={tommy} alt="Buddy" className="h-10 w-10 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">Buddy · Golden Retriever</p>
                <p className="text-[11px] text-muted-foreground">Ramna Park · Featured pet of the week</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              "Buddy loves early morning walks and making new friends at the park."
            </p>
            <button
              onClick={() => openPet(PETS[0])}
              className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium"
            >
              View pet
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function IconBtn({
  onClick,
  children,
  label,
}: {
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="relative grid h-10 w-10 place-items-center rounded-full bg-[var(--blush)] text-foreground"
    >
      {children}
    </button>
  );
}

function SectionHead({
  title,
  action,
  onAction,
  inline,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  inline?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between ${inline ? "" : "px-5"}`}>
      <h3 className="text-sm font-semibold">{title}</h3>
      {action && (
        <button onClick={onAction} className="text-xs font-medium text-[color:var(--rose-deep)]">
          {action}
        </button>
      )}
    </div>
  );
}

function EventRow({ title, when, attending }: { title: string; when: string; attending: number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--blush)] text-[color:var(--rose-deep)]">
        <Calendar className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="text-[11px] text-muted-foreground">
          {when} · {attending} attending
        </p>
      </div>
    </div>
  );
}

/* ---------------- Friends / Find Walk Buddy ---------------- */

function FriendsScreen({ go, openPet }: { go: (s: Screen) => void; openPet: (p: Pet) => void }) {
  const [tab, setTab] = useState<"Nearby" | "Matches" | "Requests">("Nearby");
  return (
    <div>
      <TopBar
        title="Find My Walk Buddy"
        onBack={() => go("home")}
        right={
          <IconBtn onClick={() => go("notifications")} label="Notifications">
            <Bell className="h-5 w-5" />
          </IconBtn>
        }
      />

      <div className="mx-5 flex gap-1 rounded-full bg-[var(--blush)] p-1">
        {(["Nearby", "Matches", "Requests"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-full py-2 text-xs font-semibold ${
              tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="mx-5 mt-4 overflow-hidden rounded-2xl border border-border">
        <div className="relative">
          <img src={mapImg} alt="Dhaka map" className="h-44 w-full object-cover" loading="lazy" />
          {/* Pins */}
          {[
            { top: "35%", left: "40%", pet: PETS[0] },
            { top: "50%", left: "60%", pet: PETS[1] },
            { top: "60%", left: "30%", pet: PETS[2] },
            { top: "30%", left: "70%", pet: PETS[3] },
          ].map((p, i) => (
            <button
              key={i}
              onClick={() => openPet(p.pet)}
              style={{ top: p.top, left: p.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background shadow"
            >
              <img src={p.pet.photo} alt={p.pet.name} className="h-9 w-9 rounded-full object-cover" />
            </button>
          ))}
          <div className="absolute bottom-2 left-2 rounded-full bg-background/90 px-3 py-1 text-[11px] font-medium">
            <MapPin className="mr-1 inline h-3 w-3" /> Dhaka
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mt-4 flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <Pill tone="rose">Within 3 km</Pill>
          <Pill tone="outline">All types</Pill>
        </div>
        <button className="text-xs font-medium text-muted-foreground" onClick={() => toast("Filters coming soon")}>
          Filters
        </button>
      </div>

      {/* Pet list */}
      <div className="mt-3 space-y-3 px-5">
        {PETS.map((pet) => (
          <div key={pet.id} className="rounded-2xl border border-border bg-card p-3">
            <div className="flex gap-3">
              <img
                src={pet.photo}
                alt={pet.name}
                className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {pet.name} · <span className="font-normal text-muted-foreground">{pet.age}</span>
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">{pet.breed}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-medium text-[color:var(--rose-deep)]">
                    {pet.distance}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {pet.tags.slice(0, 3).map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => openPet(pet)}
                className="rounded-full border border-border bg-background py-2 text-xs font-semibold"
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  openPet(pet);
                }}
                className="rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground"
              >
                Invite for Walk
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Pet Profile ---------------- */

function PetProfileScreen({
  pet,
  go,
  onInvite,
}: {
  pet: Pet;
  go: (s: Screen) => void;
  onInvite: () => void;
}) {
  return (
    <div>
      <div className="relative">
        <img src={pet.photo} alt={pet.name} className="h-80 w-full object-cover" />
        <button
          onClick={() => go("friends")}
          aria-label="Back"
          className="absolute top-5 left-5 grid h-10 w-10 place-items-center rounded-full bg-background/90 backdrop-blur"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          aria-label="Like"
          onClick={() => toast("Added to favorites")}
          className="absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-background/90 backdrop-blur"
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>

      <div className="-mt-6 rounded-t-3xl bg-background px-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold">{pet.name}</h1>
            <p className="text-xs text-muted-foreground">
              {pet.gender} · {pet.age} · {pet.breed}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3" /> {pet.location} · {pet.distance}
            </p>
          </div>
          <Pill tone="rose">Available</Pill>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-muted-foreground">Personality</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {pet.tags.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-muted-foreground">Interests</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {pet.interests.map((t) => (
              <Pill key={t} tone="outline">
                {t}
              </Pill>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-[var(--blush)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Owner
          </p>
          <p className="mt-0.5 text-sm font-semibold">{pet.owner}</p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Availability for walks
          </p>
          <p className="mt-0.5 text-sm">{pet.availability}</p>
        </div>

        <button
          onClick={onInvite}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
        >
          <Send className="h-4 w-4" /> Invite for Walk
        </button>
      </div>
    </div>
  );
}

/* ---------------- Walk Request Modal ---------------- */

function WalkRequestModal({
  pet,
  onClose,
  onSubmit,
}: {
  pet: Pet;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loc, setLoc] = useState("Ramna Park");
  const [msg, setMsg] = useState("");
  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <div
        className="w-full rounded-t-3xl bg-background p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border" />
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Invite {pet.name} for a walk</h3>
          <button aria-label="Close" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-[var(--blush)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <Field label="Select date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label="Select time">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label="Meeting location">
            <select
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option>Ramna Park</option>
              <option>Suhrawardy Udyan</option>
              <option>Gulshan Lake Park</option>
              <option>Dhanmondi Lake</option>
            </select>
          </Field>
          <Field label="Short message">
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder={`Hi ${pet.owner}, would ${pet.name} like a morning walk?`}
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </Field>
        </div>

        <button
          onClick={onSubmit}
          className="mt-5 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
        >
          Send Walk Request
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

/* ---------------- Request Sent ---------------- */

function RequestSentScreen({ pet, go }: { pet: Pet; go: (s: Screen) => void }) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--rose-light)] text-[color:var(--rose-deep)]">
        <Check className="h-10 w-10" />
      </div>
      <h2 className="mt-5 text-xl font-bold">Walk request sent to {pet.name}'s owner!</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We'll notify you as soon as {pet.owner} responds.
      </p>
      <div className="mt-6 flex w-full flex-col gap-2">
        <button
          onClick={() => go("notifications")}
          className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
        >
          View Request
        </button>
        <button
          onClick={() => go("home")}
          className="w-full rounded-full border border-border bg-background py-3.5 text-sm font-semibold"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

/* ---------------- Notifications ---------------- */

function NotificationsScreen({ go }: { go: (s: Screen) => void }) {
  const items = [
    { icon: <PawPrint className="h-5 w-5" />, text: "Someone is interested in a walk with Tommy!", time: "2m ago" },
    { icon: <Check className="h-5 w-5" />, text: "Your walk request has been accepted.", time: "1h ago" },
    { icon: <Calendar className="h-5 w-5" />, text: "New adoption event near Dhanmondi.", time: "3h ago" },
    { icon: <Sparkles className="h-5 w-5" />, text: "A pet sitter sent an offer for your post.", time: "Yesterday" },
  ];
  return (
    <div>
      <TopBar title="Notifications" onBack={() => go("home")} />
      <div className="space-y-2 px-5">
        {items.map((n, i) => (
          <div key={i} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--blush)] text-[color:var(--rose-deep)]">
              {n.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm">{n.text}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Events ---------------- */

const EVENTS = [
  {
    id: "e1",
    title: "Pet Walk at Suhrawardy Udyan",
    date: "Fri, 24 Jul",
    time: "6:30 AM",
    location: "Suhrawardy Udyan",
    attending: 42,
  },
  {
    id: "e2",
    title: "Playdate Meetup at Gulshan Lake Park",
    date: "Sat, 25 Jul",
    time: "4:00 PM",
    location: "Gulshan Lake Park",
    attending: 28,
  },
  {
    id: "e3",
    title: "Adoption Drive at PAWS Shelter",
    date: "Sun, 26 Jul",
    time: "11:00 AM",
    location: "PAWS Shelter, Dhaka",
    attending: 65,
  },
  {
    id: "e4",
    title: "Pet Carnival in Banani",
    date: "Sat, 1 Aug",
    time: "3:00 PM",
    location: "Banani Field 7",
    attending: 120,
  },
];

function EventsScreen({
  go,
  joined,
  onJoin,
}: {
  go: (s: Screen) => void;
  joined: string[];
  onJoin: (id: string, name: string) => void;
}) {
  return (
    <div>
      <TopBar title="Events" onBack={() => go("home")} />
      <div className="space-y-3 px-5">
        {EVENTS.map((e) => {
          const isJoined = joined.includes(e.id);
          return (
            <div key={e.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold">{e.title}</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {e.date} · {e.time}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {e.location}
                  </p>
                </div>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--rose-light)] text-[color:var(--rose-deep)]">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[11px] text-muted-foreground">
                  {e.attending + (isJoined ? 1 : 0)} attending
                </p>
                <button
                  onClick={() => onJoin(e.id, e.title)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    isJoined
                      ? "bg-[var(--blush)] text-[color:var(--rose-deep)]"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {isJoined ? "Joined ✓" : "Join Event"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Services ---------------- */

const SERVICE_CATS = [
  { key: "vets", label: "Vets", icon: <Stethoscope className="h-5 w-5" /> },
  { key: "groomers", label: "Groomers", icon: <Scissors className="h-5 w-5" /> },
  { key: "trainers", label: "Trainers", icon: <GraduationCap className="h-5 w-5" /> },
  { key: "shops", label: "Pet shops", icon: <ShoppingBag className="h-5 w-5" /> },
  { key: "sitting", label: "Sitting", icon: <PawPrint className="h-5 w-5" /> },
];

const SERVICES = [
  { id: "s1", name: "Dhaka Pet Hospital", cat: "Veterinarian", offer: "20% off first check-up", area: "Dhanmondi" },
  { id: "s2", name: "Fluffy Tails Grooming", cat: "Groomer", offer: "Free nail trim with bath", area: "Gulshan" },
  { id: "s3", name: "PawPro Trainers", cat: "Trainer", offer: "1 free trial session", area: "Banani" },
  { id: "s4", name: "PetMart BD", cat: "Pet shop", offer: "Buy 2 get 1 on treats", area: "Uttara" },
  { id: "s5", name: "HomeStay Pet Sitting", cat: "Sitting", offer: "Weekend package · BDT 1,200", area: "Mohammadpur" },
];

function ServicesScreen({
  go,
  saved,
  onSave,
}: {
  go: (s: Screen) => void;
  saved: string[];
  onSave: (id: string, name: string) => void;
}) {
  return (
    <div>
      <TopBar title="Services" onBack={() => go("home")} />
      <div className="grid grid-cols-5 gap-2 px-5">
        {SERVICE_CATS.map((c) => (
          <button
            key={c.key}
            onClick={() => toast(`${c.label} nearby`)}
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-[var(--blush)] py-3 text-[11px] font-medium"
          >
            <span className="text-[color:var(--rose-deep)]">{c.icon}</span>
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3 px-5">
        {SERVICES.map((s) => {
          const isSaved = saved.includes(s.id);
          return (
            <div key={s.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {s.cat} · {s.area}
                  </p>
                  <div className="mt-2 inline-flex items-center rounded-full bg-[var(--rose-light)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--rose-deep)]">
                    🎁 {s.offer}
                  </div>
                </div>
                <button
                  aria-label="Save"
                  onClick={() => onSave(s.id, s.name)}
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                    isSaved ? "bg-primary text-primary-foreground" : "bg-[var(--blush)] text-foreground"
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => toast(`Contacting ${s.name}`)}
                className="mt-3 w-full rounded-full border border-border bg-background py-2 text-xs font-semibold"
              >
                Book / Contact
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Profile ---------------- */

function ProfileScreen({
  go,
  savedCount,
  joinedCount,
}: {
  go: (s: Screen) => void;
  savedCount: number;
  joinedCount: number;
}) {
  const rows = [
    { label: "My Pets", value: "2", icon: <PawPrint className="h-4 w-4" /> },
    { label: "Past Walks", value: "12", icon: <MapPin className="h-4 w-4" /> },
    { label: "Joined Events", value: `${joinedCount}`, icon: <Calendar className="h-4 w-4" /> },
    { label: "Saved Services", value: `${savedCount}`, icon: <Bookmark className="h-4 w-4" /> },
  ];
  return (
    <div>
      <TopBar
        title="Profile"
        right={
          <button onClick={() => toast("Settings coming soon")} className="text-xs font-medium">
            Settings
          </button>
        }
      />
      <div className="flex flex-col items-center px-5">
        <img
          src={community}
          alt="Farah"
          className="h-24 w-24 rounded-full border-4 border-background object-cover ring-1 ring-border"
        />
        <h2 className="mt-3 text-lg font-bold">Farah Ahmed</h2>
        <p className="text-xs text-muted-foreground">Dhaka, Bangladesh · Member since 2024</p>
        <div className="mt-3 flex gap-2">
          <Pill tone="rose">🐾 2 pets</Pill>
          <Pill>{joinedCount} events</Pill>
        </div>
      </div>

      <div className="mt-5 px-5">
        <p className="text-xs font-semibold text-muted-foreground">My Pets</p>
        <div className="mt-2 flex gap-3">
          {[PETS[0], PETS[1]].map((p) => (
            <div key={p.id} className="flex-1 rounded-2xl border border-border bg-card p-3">
              <img src={p.photo} alt={p.name} className="h-24 w-full rounded-xl object-cover" />
              <p className="mt-2 text-sm font-semibold">{p.name}</p>
              <p className="text-[11px] text-muted-foreground">{p.breed}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 px-5">
        {rows.map((r) => (
          <div key={r.label} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              {r.icon}
              <span className="text-[11px] font-medium">{r.label}</span>
            </div>
            <p className="mt-1 text-lg font-bold">{r.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2 px-5">
        {[
          { label: "Past walks", to: "notifications" as Screen },
          { label: "Joined events", to: "events" as Screen },
          { label: "Saved services", to: "services" as Screen },
          { label: "Settings", to: "profile" as Screen },
        ].map((m) => (
          <button
            key={m.label}
            onClick={() => (m.label === "Settings" ? toast("Settings coming soon") : go(m.to))}
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm"
          >
            <span className="font-medium">{m.label}</span>
            <ChevronLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
