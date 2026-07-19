import React, { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Switch, Route, useLocation, Router as WouterRouter, Redirect, Link } from 'wouter';
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import Home from '@/pages/Home';
import Earn from '@/pages/Earn';
import Finances from '@/pages/Finances';
import Profile from '@/pages/Profile';
import Transactions from '@/pages/Transactions';
import BuyAirtime from '@/pages/BuyAirtime';
import BuyData from '@/pages/BuyData';
import PayBills from '@/pages/PayBills';
import SendMoney from '@/pages/SendMoney';
import ScanPay from '@/pages/ScanPay';
import ActionsHub from '@/pages/ActionsHub';
import UtilitiesHub from '@/pages/UtilitiesHub';
import Support from '@/pages/Support';
import RequestMoney from '@/pages/RequestMoney';
import { NexLogo } from '@/components/ui/NexLogo';

const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(174 100% 19%)",
    colorForeground: "hsl(175 100% 5%)",
    colorMutedForeground: "hsl(175 10% 40%)",
    colorDanger: "hsl(0 84.2% 60.2%)",
    colorBackground: "hsl(0 0% 100%)",
    colorInput: "hsl(150 14% 98%)",
    colorInputForeground: "hsl(175 100% 5%)",
    colorNeutral: "hsl(174 20% 90%)",
    fontFamily: "'Poppins', sans-serif",
    borderRadius: "24px",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-3xl w-[440px] max-w-full overflow-hidden shadow-2xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-2xl font-bold text-[#1A1A1A]",
    headerSubtitle: "text-[14px] text-gray-500",
    socialButtonsBlockButtonText: "font-bold text-[#1A1A1A]",
    formFieldLabel: "text-[12px] font-bold text-gray-400 uppercase tracking-widest",
    footerActionLink: "text-[#005F56] font-bold",
    footerActionText: "text-gray-500",
    dividerText: "text-gray-400 font-bold uppercase",
    identityPreviewEditButton: "text-[#005F56] font-bold",
    formFieldSuccessText: "text-emerald-500",
    alertText: "text-red-500",
    logoBox: "mb-6",
    logoImage: "w-12 h-12 object-contain",
    socialButtonsBlockButton: "border-gray-200 bg-white hover:bg-gray-50 rounded-2xl h-12",
    formButtonPrimary: "bg-[#005F56] text-white rounded-2xl h-14 font-bold text-[16px] hover:bg-[#004A43]",
    formFieldInput: "bg-gray-50 border-none rounded-2xl h-14 px-4 font-medium",
    footerAction: "mt-6",
    dividerLine: "bg-gray-100",
    alert: "bg-red-50 border border-red-100 text-red-500 rounded-2xl",
    otpCodeFieldInput: "bg-gray-50 border-none rounded-xl h-12 w-12 font-black text-[20px]",
    formFieldRow: "mb-5",
    main: "p-8",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#F8FAF9] px-4 py-12">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#F8FAF9] px-4 py-12">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F8FAF9] flex flex-col">
      <header className="px-6 py-6 flex items-center justify-between">
        <NexLogo />
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 bg-[#005F56] rounded-[32px] flex items-center justify-center mb-8 shadow-xl shadow-[#005F56]/20">
          <span className="text-white font-black text-[48px] italic leading-none lowercase">n</span>
        </div>
        <h1 className="text-[36px] font-black text-[#1A1A1A] leading-tight mb-4 tracking-tight">Smart Control of Your Money.</h1>
        <p className="text-[16px] text-gray-500 font-medium mb-12 max-w-sm">Premium digital banking built for ambitious millennials. Fast, alive, confident.</p>
        
        <div className="w-full max-w-sm space-y-4">
          <Link href="/sign-up" className="w-full py-4 bg-[#005F56] text-white font-bold rounded-2xl shadow-lg shadow-[#005F56]/20 flex justify-center active:scale-95 transition-transform">
            Get Started
          </Link>
          <Link href="/sign-in" className="w-full py-4 bg-white text-[#1A1A1A] font-bold rounded-2xl border border-gray-100 flex justify-center active:scale-95 transition-transform">
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Home />
      </Show>
      <Show when="signed-out">
        <LandingPage />
      </Show>
    </>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

const queryClient = new QueryClient();

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            
            <Route path="/earn"><ProtectedRoute><Earn /></ProtectedRoute></Route>
            <Route path="/finances"><ProtectedRoute><Finances /></ProtectedRoute></Route>
            <Route path="/profile"><ProtectedRoute><Profile /></ProtectedRoute></Route>
            <Route path="/transactions"><ProtectedRoute><Transactions /></ProtectedRoute></Route>
            
            <Route path="/buy-airtime"><ProtectedRoute><BuyAirtime /></ProtectedRoute></Route>
            <Route path="/buy-data"><ProtectedRoute><BuyData /></ProtectedRoute></Route>
            <Route path="/pay-bills"><ProtectedRoute><PayBills /></ProtectedRoute></Route>
            <Route path="/send-money"><ProtectedRoute><SendMoney /></ProtectedRoute></Route>
            <Route path="/scan-pay"><ProtectedRoute><ScanPay /></ProtectedRoute></Route>
            
            <Route path="/actions-hub"><ProtectedRoute><ActionsHub /></ProtectedRoute></Route>
            <Route path="/utilities-hub"><ProtectedRoute><UtilitiesHub /></ProtectedRoute></Route>
            <Route path="/support"><ProtectedRoute><Support /></ProtectedRoute></Route>
            
            <Route>
              <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">404 Not Found</div>
            </Route>
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
