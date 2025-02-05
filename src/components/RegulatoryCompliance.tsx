import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, FileText, History, AlertCircle, Bell, BookOpen, TrendingUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RegulatoryComplianceProps {
  selectedBank: string;
}

const RegulatoryCompliance = ({ selectedBank }: RegulatoryComplianceProps) => {
  // Mock data for regulatory compliance features
  const complianceData = {
    'SBIN.NS': {
      amlScore: 85,
      kycCompliance: 92,
      reportingEfficiency: 88,
      auditScore: 90,
      policyViolations: 3,
      sarReports: 15,
      trainingCompletion: 95,
      regulatoryImpact: "Medium"
    },
    'HDFCBANK.NS': {
      amlScore: 92,
      kycCompliance: 95,
      reportingEfficiency: 94,
      auditScore: 93,
      policyViolations: 1,
      sarReports: 12,
      trainingCompletion: 98,
      regulatoryImpact: "Low"
    },
    'ICICIBANK.NS': {
      amlScore: 88,
      kycCompliance: 90,
      reportingEfficiency: 89,
      auditScore: 91,
      policyViolations: 2,
      sarReports: 14,
      trainingCompletion: 96,
      regulatoryImpact: "Low"
    },
    'AXISBANK.NS': {
      amlScore: 87,
      kycCompliance: 89,
      reportingEfficiency: 86,
      auditScore: 88,
      policyViolations: 4,
      sarReports: 16,
      trainingCompletion: 94,
      regulatoryImpact: "Medium"
    },
    'KOTAKBANK.NS': {
      amlScore: 89,
      kycCompliance: 91,
      reportingEfficiency: 90,
      auditScore: 89,
      policyViolations: 2,
      sarReports: 13,
      trainingCompletion: 97,
      regulatoryImpact: "Low"
    }
  };

  const bankData = complianceData[selectedBank];

  const getStatusColor = (value: number) => {
    if (value >= 90) return 'text-green-500';
    if (value >= 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Regulatory & Compliance Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">AML Score</h3>
              </div>
              <p className={`text-2xl font-bold ${getStatusColor(bankData.amlScore)}`}>
                {bankData.amlScore}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">KYC Compliance</h3>
              </div>
              <p className={`text-2xl font-bold ${getStatusColor(bankData.kycCompliance)}`}>
                {bankData.kycCompliance}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h3 className="font-medium">Policy Violations</h3>
              </div>
              <p className="text-2xl font-bold text-yellow-500">
                {bankData.policyViolations}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <h3 className="font-medium">Regulatory Impact</h3>
              </div>
              <p className={`text-2xl font-bold ${getImpactColor(bankData.regulatoryImpact)}`}>
                {bankData.regulatoryImpact}
              </p>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Compliance Metric</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Reporting Automation</TableCell>
              <TableCell className={getStatusColor(bankData.reportingEfficiency)}>
                {bankData.reportingEfficiency}%
              </TableCell>
              <TableCell>Automated regulatory reporting efficiency</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Audit Analytics</TableCell>
              <TableCell className={getStatusColor(bankData.auditScore)}>
                {bankData.auditScore}%
              </TableCell>
              <TableCell>Internal audit performance score</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">SAR Reports</TableCell>
              <TableCell>
                {bankData.sarReports} reports
              </TableCell>
              <TableCell>Suspicious activity reports filed this month</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Training Completion</TableCell>
              <TableCell className={getStatusColor(bankData.trainingCompletion)}>
                {bankData.trainingCompletion}%
              </TableCell>
              <TableCell>Staff compliance training completion rate</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RegulatoryCompliance;