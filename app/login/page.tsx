import Link from "next/link";
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
        <Card className="mx-auto max-w-sm">
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
                            placeholder="tuemail@ejemplo.com"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Contraseña</Label>
                            <Link href="#" className="ml-auto inline-block text-sm underline">
                                ¿Olvidate tu contraseña?
                            </Link>
                        </div>
                        <Input id="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>

                    {/* <Button variant="outline" className="w-full">
                        Login con Google
                    </Button> */}

                </div>
                <div className="mt-4 text-center text-sm">
                    ¿Aún no tienes una cuenta?{" "}
                    <Link href="#" className="underline">
                        Regístrate
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}