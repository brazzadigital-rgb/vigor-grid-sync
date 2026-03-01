import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface TrainerCardProps {
  coachName: string;
  coachAvatar?: string | null;
}

export default function TrainerCard({ coachName, coachAvatar }: TrainerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-2xl border border-primary/20 bg-gradient-card p-4 flex items-center gap-4 hover:border-primary/40 transition-all glow-purple"
    >
      <div className="relative">
        <Avatar className="w-14 h-14 border-2 border-primary/30">
          <AvatarImage src={coachAvatar ?? undefined} />
          <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
            {coachName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-card" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <p className="text-xs text-primary font-medium">Personal Trainer</p>
        </div>
        <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{coachName}</p>
        <p className="text-xs text-muted-foreground">Disponível para feedback</p>
      </div>
      <Button size="sm" variant="outline" className="shrink-0 rounded-xl border-primary/20 text-primary hover:bg-primary/10">
        <MessageCircle className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}
