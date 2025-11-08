import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ReelPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export const ReelPlayer = ({ isOpen, onClose, videoUrl, title }: ReelPlayerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] md:max-w-md p-0 bg-black border-0 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        
        <div className="relative aspect-[9/16] bg-black">
          <video
            className="w-full h-full object-contain"
            controls
            autoPlay
            src={videoUrl}
            title={title}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
};
