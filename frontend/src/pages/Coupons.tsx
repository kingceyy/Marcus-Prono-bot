import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Coupon } from "@/lib/types";
import { CouponCard } from "@/components/CouponCard";
import { CouponDetailSheet } from "@/components/CouponDetailSheet";
import { PageTitle } from "@/components/PageTitle";
import { Skeleton } from "@/components/ui/skeleton";

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[] | null>(null);
  const [selected, setSelected] = useState<Coupon | null>(null);

  useEffect(() => {
    void api.coupons().then(setCoupons);
  }, []);

  return (
    <div>
      <PageTitle
        title="Coupons"
        subtitle="Les coupons verrouillés se débloquent en montant de classe."
      />
      {!coupons ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : coupons.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun coupon disponible pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {coupons.map((c) => (
            <CouponCard key={c.id} coupon={c} onOpenDetail={setSelected} />
          ))}
        </div>
      )}

      <CouponDetailSheet
        coupon={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}
