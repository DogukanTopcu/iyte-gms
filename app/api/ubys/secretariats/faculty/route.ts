import { NextResponse } from "next/server";

import { NextRequest } from "next/server";
import { facultySecretariats } from "../../_shared";

export async function POST(req: NextRequest) {
    try {
      const { email, password } = await req.json();
  
      const facSecretariat = facultySecretariats.find((sec) => sec.email === email && sec.password === password);
      if (facSecretariat) {
        const { password, ...facSecretariatWithoutPassword } = facSecretariat;
        return NextResponse.json(facSecretariatWithoutPassword, { status: 200 });
      } 
  
    } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}