// MapGroup.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Dropdown, Layout, Menu, Typography, Divider } from 'antd';
import { CloseOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { MenuProps } from 'antd';
import axios from 'axios';

const { Header, Content } = Layout;
const { Title } = Typography;

// Interface definitions
interface ClassValue {
  id: string;
  name: string;
}

interface Company {
  id: string;
  name: string;
}

interface Region {
  id: string;
  name: string;
}

interface Mapping {
  classValueId: string;
  regionIds: string[]; // Array of region IDs to allow multiple mappings
}

interface MapGroupProps {
  title: string;
}

// Draggable Region Item
const DraggableRegion: React.FC<{
  region: Region;
  isInMappingColumn: boolean;
  onMapped?: (regionId: string) => void;
  classValueId?: string;
  onRemoveMapping?: (classValueId: string, regionId: string) => void;
}> = ({ region, isInMappingColumn, onMapped, classValueId, onRemoveMapping }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'region',
    item: { id: region.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !isInMappingColumn,
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isInMappingColumn ? 'default' : 'move',
        padding: '12px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      onClick={isInMappingColumn ? undefined : () => onMapped && onMapped(region.id)}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="4" height="4" rx="1" fill="#8c8c8c" />
            <rect x="2" y="10" width="4" height="4" rx="1" fill="#8c8c8c" />
            <rect x="10" y="2" width="4" height="4" rx="1" fill="#8c8c8c" />
            <rect x="10" y="10" width="4" height="4" rx="1" fill="#8c8c8c" />
          </svg>
        </div>
        {region.name}
      </div>
      
      {isInMappingColumn && classValueId && onRemoveMapping && (
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onRemoveMapping(classValueId, region.id);
          }}
          size="small"
        />
      )}
    </div>
  );
};

// First column item - Class Value with dropzone
const ClassValueItem: React.FC<{
  classValue: ClassValue;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDrop: (classValueId: string, regionId: string) => void;
  mappedRegions: Region[];
  onRemoveMapping: (classValueId: string, regionId: string) => void;
  showMappedRegions: boolean;
}> = ({ 
  classValue, 
  isSelected, 
  onSelect, 
  onDrop, 
  mappedRegions, 
  onRemoveMapping,
  showMappedRegions
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'region',
    drop: (item: { id: string }) => {
      onDrop(classValue.id, item.id);
      return { dropped: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  
  return (
    <div 
      ref={drop} 
      onClick={() => onSelect(classValue.id)}
      style={{ 
        backgroundColor: isSelected ? '#f0f0f0' : isOver ? '#f6ffed' : 'white',
        cursor: 'pointer',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div style={{ 
        padding: '12px', 
        display: 'flex', 
        alignItems: 'center',
        fontWeight: isSelected ? 'bold' : 'normal',
      }}>
        {classValue.name}
      </div>
      
      {/* Show mapped regions directly in first column if showMappedRegions is true */}
      {showMappedRegions && mappedRegions.length > 0 && (
        <div style={{ 
          backgroundColor: isSelected ? '#f7f7f7' : '#fafafa',
          paddingLeft: '24px',
          borderTop: '1px solid #f0f0f0',
        }}>
          {mappedRegions.map(region => (
            <DraggableRegion
              key={region.id}
              region={region}
              isInMappingColumn={true}
              classValueId={classValue.id}
              onRemoveMapping={onRemoveMapping}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main Map Group Component
const MapGroup: React.FC<MapGroupProps> = ({ title }) => {
  const [classValues, setClassValues] = useState<ClassValue[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [availableRegions, setAvailableRegions] = useState<Region[]>([]);
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedClassValue, setSelectedClassValue] = useState<string | null>(null);
  const [showMappedRegionsInFirstColumn, setShowMappedRegionsInFirstColumn] = useState(true);

  // Height references for dynamic sizing
  const firstColumnRef = useRef<HTMLDivElement>(null);
  const secondColumnRef = useRef<HTMLDivElement>(null);

  // Fetch data from JSON server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classValuesRes, regionsRes, companiesRes] = await Promise.all([
          axios.get('http://localhost:3000/classValues'),
          axios.get('http://localhost:3000/regions'),
          axios.get('http://localhost:3000/companies'),
        ]);

        setClassValues(classValuesRes.data);
        setRegions(regionsRes.data);
        setAvailableRegions(regionsRes.data);
        setCompanies(companiesRes.data);

        if (companiesRes.data.length > 0) {
          setSelectedCompany(companiesRes.data[0]);
        }

        // Initialize mappings with empty arrays
        const initialMappings = classValuesRes.data.map((cv: ClassValue) => ({
          classValueId: cv.id,
          regionIds: []
        }));
        setMappings(initialMappings);
        
        // Set first class value as selected by default
        if (classValuesRes.data.length > 0) {
          setSelectedClassValue(classValuesRes.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle drop of a region onto a class value
  const handleDrop = (classValueId: string, regionId: string) => {
    // Find the region being mapped
    const region = availableRegions.find((r) => r.id === regionId);
    if (!region) return;

    // Update mappings
    const newMappings = [...mappings];
    const existingMappingIndex = newMappings.findIndex((m) => m.classValueId === classValueId);
    
    if (existingMappingIndex !== -1) {
      // Add regionId to the existing mapping if it's not already there
      if (!newMappings[existingMappingIndex].regionIds.includes(regionId)) {
        newMappings[existingMappingIndex].regionIds.push(regionId);
      }
    } else {
      // Create a new mapping
      newMappings.push({ classValueId, regionIds: [regionId] });
    }
    
    setMappings(newMappings);
    
    // Remove the region from available regions
    setAvailableRegions(availableRegions.filter((r) => r.id !== regionId));
    
    // Set the selected class value
    setSelectedClassValue(classValueId);
  };

  // Handle removing a mapping
  const handleRemoveMapping = (classValueId: string, regionId: string) => {
    // Find the mapping to update
    const mappingIndex = mappings.findIndex((m) => m.classValueId === classValueId);
    
    if (mappingIndex === -1) return;
    
    // Create a new mappings array
    const newMappings = [...mappings];
    
    // Remove this region from the mapping
    newMappings[mappingIndex].regionIds = newMappings[mappingIndex].regionIds.filter(
      (id) => id !== regionId
    );
    
    setMappings(newMappings);
    
    // Put the region back in available regions
    const regionToAdd = regions.find((r) => r.id === regionId);
    if (regionToAdd) {
      setAvailableRegions([...availableRegions, regionToAdd]);
    }
  };

  // Handle adding a mapping by clicking (alternative to drag-and-drop)
  const handleAddMapping = (regionId: string) => {
    // Use the currently selected class value or the first one if none selected
    const targetClassValueId = selectedClassValue || classValues[0]?.id;
    
    if (targetClassValueId) {
      handleDrop(targetClassValueId, regionId);
    }
  };

  // Get all mapped regions for a specific class value
  const getMappedRegionsForClassValue = (classValueId: string) => {
    const mapping = mappings.find((m) => m.classValueId === classValueId);
    if (!mapping) return [];
    
    return mapping.regionIds
      .map((regionId) => regions.find((r) => r.id === regionId))
      .filter((region): region is Region => region !== undefined);
  };

  // Get all mapped regions for the selected class value
  const getMappedRegionsForSelectedClassValue = () => {
    if (!selectedClassValue) return [];
    return getMappedRegionsForClassValue(selectedClassValue);
  };

  // Dropdown menu items for company selection
  const companyMenuItems: MenuProps['items'] = companies.map((company) => ({
    key: company.id,
    label: company.name,
  }));

  const handleCompanySelect: MenuProps['onClick'] = ({ key }) => {
    const company = companies.find((c) => c.id === key);
    if (company) {
      setSelectedCompany(company);
    }
  };

  // Handle class value click to show its mappings in the middle column
  const handleClassValueClick = (classValueId: string) => {
    setSelectedClassValue(classValueId);
  };

  // Toggle option for showing mapped regions in first column
  const handleToggleView = () => {
    setShowMappedRegionsInFirstColumn(!showMappedRegionsInFirstColumn);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout style={{ background: 'white', height: '100vh' }}>
        <Header style={{ background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>Map Group Class</Title>
          </div>
          <CloseOutlined style={{ fontSize: '20px' }} />
        </Header>
        
        <Content style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={5}>Demo Mark 1: {title}</Title>
            <Button icon={<EyeOutlined />}>Preview</Button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            {/* First Column: Class Values */}
            <Card 
              title="Class Values" 
              style={{ width: '33%', minHeight: '500px' }}
              bodyStyle={{ padding: 0 }}
              ref={firstColumnRef}
            >
              {classValues.map((classValue) => {
                const mappedRegions = getMappedRegionsForClassValue(classValue.id);
                
                return (
                  <ClassValueItem
                    key={classValue.id}
                    classValue={classValue}
                    isSelected={selectedClassValue === classValue.id}
                    onSelect={handleClassValueClick}
                    onDrop={handleDrop}
                    mappedRegions={mappedRegions}
                    onRemoveMapping={handleRemoveMapping}
                    showMappedRegions={showMappedRegionsInFirstColumn}
                  />
                );
              })}
            </Card>
            
            {/* Second Column: Mapped Regions */}
            <Card 
              title={
                <Dropdown menu={{ items: companyMenuItems, onClick: handleCompanySelect }}>
                  <div style={{ cursor: 'pointer' }}>
                    {selectedCompany?.name || 'Select Company'}
                  </div>
                </Dropdown>
              }
              style={{ width: '33%', minHeight: '500px' }}
              bodyStyle={{ padding: 0 }}
              extra={<ReloadOutlined />}
              ref={secondColumnRef}
            >
              {selectedClassValue && !showMappedRegionsInFirstColumn && (
                getMappedRegionsForSelectedClassValue().map((region) => (
                  <DraggableRegion
                    key={region.id}
                    region={region}
                    isInMappingColumn={true}
                    classValueId={selectedClassValue}
                    onRemoveMapping={handleRemoveMapping}
                  />
                ))
              )}
              
              {(!selectedClassValue || (showMappedRegionsInFirstColumn && getMappedRegionsForSelectedClassValue().length === 0)) && (
                <div style={{ padding: '16px', color: '#999' }}>
                  {showMappedRegionsInFirstColumn 
                    ? "Mapped regions will appear in the first column" 
                    : "Select a class value to see mappings"}
                </div>
              )}
            </Card>
            
            {/* Third Column: Available Regions */}
            <Card 
              title={
                <Dropdown menu={{ items: [{ key: 'all', label: 'All Regions' }] }}>
                  <div style={{ cursor: 'pointer' }}>
                    Sandbox Company_AU_10
                  </div>
                </Dropdown>
              }
              style={{ width: '33%', minHeight: '500px' }}
              bodyStyle={{ padding: 0 }}
            >
              {availableRegions.map((region) => (
                <DraggableRegion
                  key={region.id}
                  region={region}
                  isInMappingColumn={false}
                  onMapped={handleAddMapping}
                />
              ))}
              
              {availableRegions.length === 0 && (
                <div style={{ padding: '16px', color: '#999' }}>
                  All regions have been mapped
                </div>
              )}
            </Card>
          </div>
          
          <div style={{ marginTop: '16px', marginBottom: '16px' }}>
            <Button 
              onClick={handleToggleView}
              style={{ marginRight: '16px' }}
            >
              {showMappedRegionsInFirstColumn ? "Show mappings in middle column" : "Show mappings in first column"}
            </Button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '16px' }}>
            <Button type="primary" style={{ backgroundColor: '#1B6F71' }}>Update</Button>
            <Button>Cancel</Button>
          </div>
        </Content>
      </Layout>
    </DndProvider>
  );
};

export default MapGroup;