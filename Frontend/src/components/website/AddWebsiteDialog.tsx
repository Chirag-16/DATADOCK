
// import { useState } from 'react';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';

// interface AddWebsiteDialogProps {
//   open: boolean;
//   setOpen: (open: boolean) => void;
// }

// export function AddWebsiteDialog({ open, setOpen }: AddWebsiteDialogProps) {
//   const [websiteUrl, setWebsiteUrl] = useState('');
//   const [websiteName, setWebsiteName] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!websiteUrl || !websiteName) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     // Validate URL format
//     try {
//       new URL(websiteUrl);
//     } catch (e) {
//       toast.error("Please enter a valid URL");
//       return;
//     }

//     setIsLoading(true);
    
//     // Simulate adding website
//     setTimeout(() => {
//       toast.success(`Website ${websiteName} added successfully`);
//       setIsLoading(false);
//       setOpen(false);
//       setWebsiteUrl('');
//       setWebsiteName('');
      
//       // In a real app, we would add this to state or dispatch an action
//     }, 1000);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add a new website</DialogTitle>
//           <DialogDescription>
//             Enter the website details to start monitoring
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right">
//                 Name
//               </Label>
//               <Input
//                 id="name"
//                 value={websiteName}
//                 onChange={(e) => setWebsiteName(e.target.value)}
//                 className="col-span-3"
//                 placeholder="My Website"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="url" className="text-right">
//                 URL
//               </Label>
//               <Input
//                 id="url"
//                 value={websiteUrl}
//                 onChange={(e) => setWebsiteUrl(e.target.value)}
//                 className="col-span-3"
//                 placeholder="https://example.com"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => setOpen(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? 'Adding...' : 'Add Website'}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }


import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AddWebsiteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onWebsiteAdded?: () => void; // Callback to refresh website list
}

export function AddWebsiteDialog({ open, setOpen, onWebsiteAdded }: AddWebsiteDialogProps) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!websiteUrl || !websiteName) {
      toast.error("Please fill all fields");
      return;
    }

    // Validate URL format
    try {
      new URL(websiteUrl);
    } catch (e) {
      toast.error("Please enter a valid URL (include http:// or https://)");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/websites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: websiteName,
          url: websiteUrl,
          checkInterval: 5 // Default interval
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast.success(`Website ${data.name} added successfully`);
      
      // Reset form
      setWebsiteUrl('');
      setWebsiteName('');
      setOpen(false);
      
      // Trigger parent component to refresh website list
      if (onWebsiteAdded) {
        onWebsiteAdded();
      }
    } catch (error) {
      console.error('Error adding website:', error);
      toast.error("Failed to add website. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new website</DialogTitle>
          <DialogDescription>
            Enter the website details to start monitoring
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                className="col-span-3"
                placeholder="My Website"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Website'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
