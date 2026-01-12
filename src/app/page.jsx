"use client";
import { useEffect, useState } from "react";
import elvxk from "./elvxk";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

export default function Home() {
  useEffect(() => {
    console.info(elvxk);
  }, []);

  // === STATE ===
  const [challengeDomains, setChallengeDomains] = useState("");
  const [challengeResult, setChallengeResult] = useState(null);
  const [issueId, setIssueId] = useState("");
  const [issueResult, setIssueResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // === VALIDASI DOMAIN ===
  const validateDomains = (domains) => {
    const domainList = domains
      .split(",")
      .map(d => d.trim())
      .filter(d => d.length > 0);
    if (domainList.length === 0) return { error: "Please enter at least 1 domain" };

    // Regex valid domain sederhana, bisa support subdomain
    const domainRegex = /^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
    const invalidDomains = domainList.filter(d => !domainRegex.test(d));
    if (invalidDomains.length > 0) return { error: `Invalid domain(s): ${invalidDomains.join(", ")}` };

    return { domainList };
  };

  // === HANDLER CHALLENGE ===
  const handleChallengeSubmit = async () => {
    const { domainList, error } = validateDomains(challengeDomains);
    if (error) {
      setChallengeResult({ error });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/challenge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: domainList }),
      });
      const data = await res.json();
      setChallengeResult(data);
    } catch (err) {
      setChallengeResult({ error: err.message });
    }
    setLoading(false);
  };

  // === HANDLER ISSUE ===
  const handleIssueSubmit = async () => {
    if (!issueId.trim()) {
      setIssueResult({ error: "Please enter an ID" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/issue/${issueId}`, {
        method: "POST",
      });
      const data = await res.json();
      setIssueResult(data);
    } catch (err) {
      setIssueResult({ error: err.message });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-6">
      <div className="min-h-screen py-4 pt-6 flex flex-col gap-8 lg:gap-10 relative">
        <Image
          src="/acmelogo.webp"
          alt="Logo Lookup"
          width={366}
          height={180}
          className="hover:scale-110 self-center hover:-rotate-3 transition-all hover:cursor-cell"
          draggable={false}
          priority
        />

        <Tabs defaultValue="challenge">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger value="challenge">Challenge</TabsTrigger>
            <TabsTrigger value="issue">Issue</TabsTrigger>
          </TabsList>

          {/* === CHALLENGE TAB === */}
          <TabsContent value="challenge">
            <Card className="bg-white">
              <CardTitle className="w-full flex justify-center items-center text-xl">Order Challenge</CardTitle>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="challenge-domains">Input Domains (comma separated)</Label>
                  <Input
                    id="challenge-domains"
                    value={challengeDomains}
                    onChange={(e) => setChallengeDomains(e.target.value)}
                    placeholder="example.com, www.example.com"
                  />
                </div>
                {challengeResult && (
                  challengeResult.error ? (
                    <div className="p-4 bg-red-100 text-red-800 rounded">{challengeResult.error}</div>
                  ) : (
                    <div className="p-4 bg-green-100 text-green-800 rounded space-y-2">
                      <p className="items-center self-center flex w-full flex-col justify-center"><strong>Success</strong> Please Save Request ID bellow for Issue porcess</p>
                      <p className="items-center self-center flex w-full flex-col justify-center border p-2 bg-white mb-4"> {challengeResult.id}</p>
                      {challengeResult.dns && challengeResult.dns.length > 0 && (
                        <div>
                          <p><strong>DNS Records:</strong></p>
                          <div className="border border-gray-300 rounded overflow-hidden">
                            {challengeResult.dns.map((record, idx) => (
                              <div
                                key={idx}
                                className={`p-2 border-b last:border-b-0 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                              >
                                <p><strong>Type:</strong> {record.type}</p>
                                <p><strong>Record:</strong> {record.record}</p>
                                <p><strong>Value:</strong> <code>{record.value}</code></p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleChallengeSubmit} disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* === ISSUE TAB === */}
          <TabsContent value="issue">
            <Card className="bg-white">
              <CardTitle className="w-full flex justify-center items-center text-xl">Issue SSL</CardTitle>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="issue-id">Input ID</Label>
                  <Input
                    id="issue-id"
                    value={issueId}
                    onChange={(e) => setIssueId(e.target.value)}
                    placeholder="Enter ID"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleIssueSubmit} disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {issueResult && (
          issueResult.status === "error" || issueResult.error ? (
            <Card className='bg-white'>
              <CardContent>
                <div className="p-4 bg-red-100 text-red-800 rounded">
                  <strong>Error:</strong> {issueResult.message || issueResult.error}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className='bg-white'>
              <CardContent>
                <div className="p-4 bg-green-100 text-green-800 rounded space-y-3">
                  {/* Message */}
                  <div className="bg-green-50 p-2 rounded flex flex-col">
                    <span className="font-semibold">Message:</span>
                    <span>{issueResult.message}</span>
                  </div>

                  {/* Domains */}
                  <div className="bg-green-50 p-2 rounded flex flex-col">
                    <span className="font-semibold">Domains:</span>
                    <span>{issueResult.domains.join(", ")}</span>
                  </div>

                  {/* Pisahkan Certificate */}
                  {(() => {
                    const certs = issueResult.certificate
                      .split(/-----END CERTIFICATE-----\n?/g)
                      .map(c => c.trim())
                      .filter(c => c)
                      .map(c => c + "\n-----END CERTIFICATE-----");

                    const leafCert = certs[0];
                    const bundleCert = certs.slice(1).join("\n");

                    return (
                      <>
                        {/* Leaf Certificate */}
                        <div className="bg-green-50 p-2 rounded flex flex-col">
                          <span className="font-semibold">Leaf Certificate:</span>
                          <pre className="text-xs overflow-x-auto mt-1 bg-white p-2 border-2">{leafCert}</pre>
                        </div>

                        {/* Bundle / Intermediate */}
                        {bundleCert && (
                          <div className="bg-green-50 p-2 rounded flex flex-col">
                            <span className="font-semibold">Certificate Bundle (Intermediate):</span>
                            <pre className="text-xs overflow-x-auto mt-1 bg-white p-2 border-2">{bundleCert}</pre>
                          </div>
                        )}
                      </>
                    );
                  })()}

                  {/* Private Key */}
                  <div className="bg-green-50 p-2 rounded flex flex-col">
                    <span className="font-semibold">Private Key:</span>
                    <pre className="text-xs overflow-x-auto mt-1 bg-white p-2 border-2">{issueResult.privateKey}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}

        <div className="min-h-20"></div>
        <Footer />
      </div>
    </div>
  );
}
