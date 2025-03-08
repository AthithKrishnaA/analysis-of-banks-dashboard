
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, CameraShake } from '@react-three/drei';
import * as THREE from 'three';
import { toast } from "@/components/ui/use-toast";
import { Info, Circle, CircleDot, HelpCircle } from 'lucide-react';

interface Branch {
  type: string;
  count: number;
  color: string;
}

interface BranchNetwork3DProps {
  branchData: {
    urban: number;
    semiUrban: number;
    rural: number;
    metro: number;
  };
  totalBranches: number;
}

const BranchSphere = ({ position, size, color, label, count, onClick }: { 
  position: [number, number, number]; 
  size: number; 
  color: string; 
  label: string;
  count: number;
  onClick: () => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group position={new THREE.Vector3(...position)}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#ffffff" : color} 
          metalness={0.4}
          roughness={0.2}
          emissive={hovered ? color : "black"}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>
      <Text
        position={[0, size + 0.3, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      <Text
        position={[0, size + 0.6, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {count.toLocaleString()}
      </Text>
      {/* Info icon to indicate clickable */}
      <mesh position={[0, size - 0.2, size]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <Text
        position={[0, size - 0.2, size + 0.2]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        i
      </Text>
    </group>
  );
};

const Scene = ({ branchData, totalBranches, onBranchSelect }: {
  branchData: BranchNetwork3DProps['branchData'];
  totalBranches: number;
  onBranchSelect: (type: string, count: number, percentage: number) => void;
}) => {
  const { camera } = useThree();
  
  // Set initial camera position
  React.useEffect(() => {
    camera.position.set(0, 2, 10);
  }, [camera]);

  const branches: Branch[] = [
    { type: 'Urban', count: branchData.urban, color: '#0088FE' },
    { type: 'Semi-Urban', count: branchData.semiUrban, color: '#00C49F' },
    { type: 'Rural', count: branchData.rural, color: '#FFBB28' },
    { type: 'Metro', count: branchData.metro, color: '#FF8042' },
  ];

  // Calculate positions in a circle
  const radius = 4;
  const positions: [number, number, number][] = branches.map((_, index) => {
    const angle = (index / branches.length) * Math.PI * 2;
    return [
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius,
    ];
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {branches.map((branch, index) => {
        // Calculate size based on percentage of total
        const percentage = branch.count / totalBranches;
        const size = 0.5 + percentage * 2;
        
        return (
          <BranchSphere
            key={branch.type}
            position={positions[index]}
            size={size}
            color={branch.color}
            label={branch.type}
            count={branch.count}
            onClick={() => onBranchSelect(branch.type, branch.count, percentage * 100)}
          />
        );
      })}
      
      <Text
        position={[0, -2, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Total: {totalBranches.toLocaleString()} branches
      </Text>
      
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
      />
      <CameraShake intensity={0.2} />
    </>
  );
};

const getBranchDetails = (type: string) => {
  switch(type) {
    case 'Urban':
      return {
        avgTransactions: '1,450 daily',
        customerFootfall: '210 daily',
        topServices: 'Loans, Investment Advisory',
        digitalAdoption: '78%',
        staffCount: '15-20'
      };
    case 'Semi-Urban':
      return {
        avgTransactions: '980 daily',
        customerFootfall: '145 daily',
        topServices: 'Agricultural Loans, Savings',
        digitalAdoption: '65%',
        staffCount: '10-15'
      };
    case 'Rural':
      return {
        avgTransactions: '650 daily',
        customerFootfall: '95 daily',
        topServices: 'Microfinance, Basic Banking',
        digitalAdoption: '42%',
        staffCount: '5-10'
      };
    case 'Metro':
      return {
        avgTransactions: '2,200 daily',
        customerFootfall: '320 daily',
        topServices: 'Wealth Management, Corporate Banking',
        digitalAdoption: '92%',
        staffCount: '25-35'
      };
    default:
      return {
        avgTransactions: 'N/A',
        customerFootfall: 'N/A',
        topServices: 'N/A',
        digitalAdoption: 'N/A',
        staffCount: 'N/A'
      };
  }
};

const BranchNetwork3D: React.FC<BranchNetwork3DProps> = ({ 
  branchData, 
  totalBranches 
}) => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  
  const handleBranchSelect = (type: string, count: number, percentage: number) => {
    setSelectedBranch(type);
    const details = getBranchDetails(type);
    
    // Show a toast with branch details
    toast({
      title: `${type} Branch Network Details`,
      description: (
        <div className="space-y-2">
          <p className="font-semibold">{count.toLocaleString()} branches ({percentage.toFixed(1)}% of network)</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
            <span className="text-gray-500">Avg. Transactions:</span>
            <span>{details.avgTransactions}</span>
            <span className="text-gray-500">Customer Footfall:</span>
            <span>{details.customerFootfall}</span>
            <span className="text-gray-500">Top Services:</span>
            <span>{details.topServices}</span>
            <span className="text-gray-500">Digital Adoption:</span>
            <span>{details.digitalAdoption}</span>
            <span className="text-gray-500">Staff Count:</span>
            <span>{details.staffCount}</span>
          </div>
        </div>
      ),
      duration: 5000,
    });
    
    console.log(`Selected branch type: ${type} with ${count} branches`);
  };

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <Canvas shadows>
        <Scene 
          branchData={branchData} 
          totalBranches={totalBranches} 
          onBranchSelect={handleBranchSelect} 
        />
      </Canvas>
      
      {/* Overlay with interaction instructions */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm p-2 rounded">
        <p className="flex items-center gap-1">
          <Circle className="h-3 w-3" /> Drag to rotate | Scroll to zoom
        </p>
        <p className="flex items-center gap-1">
          <CircleDot className="h-3 w-3" /> Click on spheres for detailed info
        </p>
      </div>
    </div>
  );
};

export default BranchNetwork3D;
