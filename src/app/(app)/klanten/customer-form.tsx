import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface CustomerFormData {
  company: string;
  contact: string;
  email: string;
  phone: string;
  adres1: string;
  adres2: string;
}

export function CustomerForm({
  action,
  customer,
}: {
  action: (formData: FormData) => void;
  customer: CustomerFormData;
}) {
  return (
    <form action={action} className="space-y-5">
      <div className="rounded-xl border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="company">Bedrijfsnaam / klant *</Label>
            <Input id="company" name="company" defaultValue={customer.company} required />
          </div>
          <div>
            <Label htmlFor="contact">Contactpersoon</Label>
            <Input id="contact" name="contact" defaultValue={customer.contact} />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" defaultValue={customer.email} />
          </div>
          <div>
            <Label htmlFor="phone">Telefoon</Label>
            <Input id="phone" name="phone" defaultValue={customer.phone} />
          </div>
          <div />
          <div>
            <Label htmlFor="adres1">Adres</Label>
            <Input id="adres1" name="adres1" defaultValue={customer.adres1} placeholder="Hessenweg 91" />
          </div>
          <div>
            <Label htmlFor="adres2">Postcode + plaats</Label>
            <Input id="adres2" name="adres2" defaultValue={customer.adres2} placeholder="7722 SX" />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="bg-brand-lime text-brand-lime-ink hover:bg-brand-lime/90">
          Opslaan
        </Button>
      </div>
    </form>
  );
}
