import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SignInModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/auth/sign-in");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <h2 className="text-xl font-bold mb-4">Sign in to continue</h2>
        <Button onClick={handleSignIn}>Sign in to your account</Button>
      </DialogContent>
    </Dialog>
  );
} 