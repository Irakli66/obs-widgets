"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bonusHuntSchema } from "@/lib/schemas/bonusHunt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useBonusHuntStore } from "../../../store/bonusHuntStore";

type BonusHuntForm = z.infer<typeof bonusHuntSchema>;

export default function CreateBonusHunt() {
  const addBonusHunt = useBonusHuntStore((s) => s.addBonusHunt);

  const form = useForm<BonusHuntForm>({
    resolver: zodResolver(bonusHuntSchema),
    defaultValues: {
      name: "",
      startBalance: 0,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const onSubmit = (data: BonusHuntForm) => {
    const newHunt = {
      id: Date.now(),
      name: data.name,
      startBalance: data.startBalance,
      currentBalance: 0,
      createdAt: new Date(),
      bonuses: [],
      avrgBet: 0,
      avrgBEX: 0,
      currentAvrgX: 0,
    };

    addBonusHunt(newHunt);
    toast.success("Bonus hunt created!");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-white">
      <div>
        <Label htmlFor="name">Hunt Name</Label>
        <Input
          id="name"
          placeholder="e.g. Pragmatic Fiesta"
          {...register("name")}
          className="mt-1 bg-slate-800 border-purple-500/30 text-white placeholder-purple-400"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="startBalance">Starting Balance</Label>
        <Input
          id="startBalance"
          type="number"
          step="0.01"
          placeholder="e.g. 500.00"
          {...register("startBalance", { valueAsNumber: true })}
          className="mt-1 bg-slate-800 border-purple-500/30 text-white placeholder-purple-400"
        />
        {errors.startBalance && (
          <p className="text-red-500 text-sm mt-1">
            {errors.startBalance.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        Create Bonus Hunt
      </Button>
    </form>
  );
}
