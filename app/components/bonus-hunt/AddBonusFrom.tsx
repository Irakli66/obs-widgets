import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { bonusSchema } from "@/lib/schemas/bonusHunt"; // or wherever it's located
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Bonus } from "@/app/bonus-hunt/page"; // or your actual type
import { useBonusHuntStore } from "@/store/bonusHuntStore";

const AddBonusForm = ({ huntId }: { huntId: number }) => {
  const addBonusToHunt = useBonusHuntStore((s) => s.addBonusToHunt);

  const form = useForm<z.infer<typeof bonusSchema>>({
    resolver: zodResolver(bonusSchema),
    defaultValues: {
      name: "",
      betSize: 0,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const onSubmit = (data: z.infer<typeof bonusSchema>) => {
    const bonus: Bonus = {
      id: Date.now(),
      name: data.name,
      betSize: data.betSize,
      paid: 0,
      paidX: 0,
    };

    addBonusToHunt(huntId, bonus);
    toast.success("Bonus added!");
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 border p-5 rounded bg-white"
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor="name">Bonus Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="betSize">Bet Size</Label>
        <Input
          id="betSize"
          type="number"
          step="0.01"
          {...register("betSize", { valueAsNumber: true })}
        />
        {errors.betSize && (
          <p className="text-red-500 text-sm">{errors.betSize.message}</p>
        )}
      </div>

      <Button type="submit">Add Bonus</Button>
    </form>
  );
};

export default AddBonusForm;
