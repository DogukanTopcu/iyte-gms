import { NextResponse } from "next/server";

import { NextRequest } from "next/server";
import { departmentSecretariats } from "../../_shared";

export async function POST(req: NextRequest) {
    try {
      const { email, password } = await req.json();
      
      const deptSecretariat = departmentSecretariats.find((sec) => sec.email === email && sec.password === password);
      if (deptSecretariat) {
        const { password, ...deptSecretariatWithoutPassword } = deptSecretariat;
        return NextResponse.json(deptSecretariatWithoutPassword, { status: 200 });
      }
  
    } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}