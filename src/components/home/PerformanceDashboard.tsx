import { motion } from "framer-motion";
import { useDailyMetrics } from "@/hooks/use-performance-data";
import PerformanceHeroRing from "./PerformanceHeroRing";
import { Skeleton } from "@/components/ui/skeleton";

export default function PerformanceDashboard() {
  const { data: metrics, isLoading } = useDailyMetrics();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-52 rounded-3xl" />
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PerformanceHeroRing metrics={metrics} />
    </motion.div>
  );
}
