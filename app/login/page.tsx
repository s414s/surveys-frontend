import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
    return (
        <div className="flex items-center min-h-screen max-h-screen">
            <Card className="mx-auto max-w-sm w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Introduce tu email para loguearte en tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tuemail@cargotrack.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Contraseña</Label>
                                {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                                ¿Olvidate tu contraseña?
                                </Link> */}
                            </div>
                            <Input id="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}