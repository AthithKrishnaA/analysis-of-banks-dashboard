
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, CameraShake } from '@react-three/drei';
import { Vector3 } from 'three';

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
    <group position={new Vector3(...position)}>
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
    </group>
  );
};

const Scene = ({ branchData, totalBranches, onBranchSelect }: {
  branchData: BranchNetwork3DProps['branchData'];
  totalBranches: number;
  onBranchSelect: (type: string) => void;
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
            onClick={() => onBranchSelect(branch.type)}
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

const BranchNetwork3D: React.FC<BranchNetwork3DProps> = ({ 
  branchData, 
  totalBranches 
}) => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  
  const handleBranchSelect = (type: string) => {
    setSelectedBranch(type);
    // You could trigger an event or update state in the parent component
    console.log(`Selected branch type: ${type}`);
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
      
      {/* Optional overlay with interaction instructions */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm p-2 rounded">
        <p>🖱️ Drag to rotate | Scroll to zoom</p>
        <p>👆 Click on spheres for details</p>
      </div>
    </div>
  );
};

export default BranchNetwork3D;
