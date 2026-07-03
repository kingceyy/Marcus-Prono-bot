import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Detecte si l'URL pointe vers une animation Lottie (.json) plutot qu'une image.
 * Permet d'ajouter des coupons animes plus tard sans changer le schema :
 * il suffit de renseigner une URL .json dans le meme champ image_url.
 */
function isLottieUrl(url: string): boolean {
  return /\.json(\?.*)?$/i.test(url);
}

function LottieMedia({ url, className }: { url: string; className?: string }) {
  const [Lottie, setLottie] = useState<React.ComponentType<Record<string, unknown>> | null>(
    null,
  );
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Import dynamique : lottie-react n'est charge que si un coupon animé existe reellement.
    Promise.all([
      import("lottie-react").then((m) => m.default),
      fetch(url).then((r) => {
        if (!r.ok) throw new Error("lottie fetch failed");
        return r.json();
      }),
    ])
      .then(([LottieComp, data]) => {
        if (cancelled) return;
        setLottie(() => LottieComp);
        setAnimationData(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (failed) {
    return (
      <div className={cn("flex items-center justify-center bg-muted text-xs text-muted-foreground", className)}>
        Animation indisponible
      </div>
    );
  }

  if (!Lottie || !animationData) {
    return <div className={cn("animate-pulse bg-muted", className)} />;
  }

  return (
    <div className={className}>
      <Lottie animationData={animationData} loop autoplay style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

type CouponMediaProps = {
  url: string;
  alt?: string;
  /**
   * "thumbnail" : cadre fixe recadre (utilise dans les cartes de la liste).
   * "detail" : s'adapte a l'orientation reelle du media (portrait ou paysage)
   * pour l'affichage plein format dans la fiche detail.
   */
  variant: "thumbnail" | "detail";
  className?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
};

export function CouponMedia({
  url,
  alt = "",
  variant,
  className,
  overlayClassName,
  children,
}: CouponMediaProps) {
  const [ratio, setRatio] = useState<number | null>(null);

  if (isLottieUrl(url)) {
    const lottieClassName =
      variant === "thumbnail"
        ? cn("relative h-40 w-full overflow-hidden bg-muted", className)
        : cn("relative w-full overflow-hidden rounded-xl bg-muted", className);
    return (
      <div className={lottieClassName}>
        <LottieMedia url={url} className="h-full w-full" />
        {children && (
          <div className={cn("pointer-events-none absolute inset-0", overlayClassName)}>
            {children}
          </div>
        )}
      </div>
    );
  }

  if (variant === "thumbnail") {
    return (
      <div className={cn("relative h-40 w-full overflow-hidden bg-muted", className)}>
        <img src={url} alt={alt} className="h-full w-full object-cover" loading="lazy" />
        {children && (
          <div className={cn("pointer-events-none absolute inset-0", overlayClassName)}>
            {children}
          </div>
        )}
      </div>
    );
  }

  // variant === "detail" : le conteneur adopte le ratio naturel de l'image
  // (portrait -> affichage vertical, paysage -> affichage horizontal),
  // avec un plafond de hauteur pour ne jamais deborder de la fiche.
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-muted",
        !ratio && "aspect-[4/5] animate-pulse",
        className,
      )}
      style={ratio ? { aspectRatio: ratio, maxHeight: "70dvh" } : undefined}
    >
      <img
        src={url}
        alt={alt}
        className={cn(
          "h-full w-full object-contain transition-opacity duration-300",
          ratio ? "opacity-100" : "opacity-0",
        )}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            setRatio(img.naturalWidth / img.naturalHeight);
          }
        }}
      />
      {children && (
        <div className={cn("pointer-events-none absolute inset-0", overlayClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}
