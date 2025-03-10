  // MapGroup.tsx
  import React, { useState, useEffect, useRef } from 'react';
  import { Button, Card, Dropdown, Layout, Menu, Typography, Divider,Modal } from 'antd';
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
        {/* Inside ClassValueItem */} 
  {mappedRegions.length > 0 && (
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
    const [availableRegions, setAvailableRegions] = useState<Region[]>([
      { id: '1', name: 'Admin' },
      { id: '2', name: 'East' },
      { id: '3', name: 'West' },
      { id: '4', name: 'North' },
      { id: '5', name: 'South' },
    ]);
    const [mappings, setMappings] = useState<Mapping[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [selectedClassValue, setSelectedClassValue] = useState<string | null>(null);
    const [showMappedRegionsInFirstColumn, setShowMappedRegionsInFirstColumn] = useState(true);

    // Height references for dynamic sizing
    const firstColumnRef = useRef<HTMLDivElement>(null);
    const secondColumnRef = useRef<HTMLDivElement>(null);

    
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handlePreview = () => {
      setIsModalVisible(true);
    };
  
    // Function to close preview modal
    const handleClosePreview = () => {
      setIsModalVisible(false);
    };


    // Fetch data from JSON server
    useEffect(() => {
      const fetchData = async () => {
        try {
          const id = localStorage.getItem("selectedGroupClassId"); // Get ID from localStorage
          const token = localStorage.getItem("token"); // Retrieve token
    
          if (!id) {
            console.error("ID not found!");
            return;
          }
    
          if (!token) {
            console.error("Authentication token not found!");
            return;
          }
    
          const response = await axios.get(
            `https://sandboxgathernexusapi.azurewebsites.net/api/GRC/GetGRCRecordById?id=${id}`,
            {
              headers: {
                "Authorization": `Bearer ${token}`, // Send token in headers
                "Content-Type": "application/json"
              }
            }
          );
    
          if (response.data.responseStatus !== 3) {
            console.error("Error fetching data:", response.data.message);
            return;
          }
    
          const fetchedClassValues = response.data.result.flatMap(group =>
            group.classValues.map(classValue => ({
              id: classValue.classValueId.toString(),
              name: classValue.classValue
            }))
          );
    
          setClassValues(fetchedClassValues);
    
          // Initialize mappings
          const initialMappings = fetchedClassValues.map(cv => ({
            classValueId: cv.id,
            regionIds: []
          }));
          setMappings(initialMappings);
    
          // Set first class value as selected by default
          if (fetchedClassValues.length > 0) {
            setSelectedClassValue(fetchedClassValues[0].id);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      fetchData();
    }, []);
    

    
    const handleDrop = (classValueId: string, regionId: string) => {
      const region = availableRegions.find((r) => r.id === regionId);
      if (!region) return;
    
      setMappings((prevMappings) => {
        const newMappings = [...prevMappings];
        const existingMappingIndex = newMappings.findIndex((m) => m.classValueId === classValueId);
    
        if (existingMappingIndex !== -1) {
          if (!newMappings[existingMappingIndex].regionIds.includes(regionId)) {
            newMappings[existingMappingIndex].regionIds.push(regionId);
          }
        } else {
          newMappings.push({ classValueId, regionIds: [regionId] });
        }
    
        return newMappings;
      });
    
      // Remove the region from available regions
      setAvailableRegions((prevAvailableRegions) => 
        prevAvailableRegions.filter((r) => r.id !== regionId)
      );
    
      // Add the region to mapped regions
      setRegions((prevRegions) => [...prevRegions, region]);
    
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
        .map((regionId) => availableRegions.find((r) => r.id === regionId) || regions.find((r) => r.id === regionId))
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

  const handleUpdate = async () => {
  try {
    // Debugging logs
    console.log("Token:", localStorage.getItem("token"));
    console.log("Group ID (Using selectedGroupClassId):", localStorage.getItem("selectedGroupClassId"));
    console.log("Group Class ID:", localStorage.getItem("selectedGroupClassId"));

    // Retrieve data from localStorage
    const token = localStorage.getItem("token") || "";
    const groupId = localStorage.getItem("selectedGroupClassId") || "0"; // Using selectedGroupClassId as groupId
    const groupClassId = localStorage.getItem("selectedGroupClassId") || "0";

    if (!token || groupId === "0" || groupClassId === "0") {
      alert("Authentication token or required IDs are missing! Please check your login or selection.");
      return;
    }

    // Construct API payload
    const payload = {
      groupId: Number(groupId), // Now using selectedGroupClassId as groupId
      groupClassId: Number(groupClassId),
      gRCValuesDetails: mappings.map((mapping) => ({
        id: 0,
        groupClassValueId: Number(mapping.classValueId),
        erpCompanyId: selectedCompany?.id || "",
        erpClassId: "",
        erpClassName: "",
        trackingCategoryId: mapping.regionIds.join(","),
      })),
    };

    console.log("Sending API payload:", JSON.stringify(payload, null, 2));

    // Store mapped data in localStorage before API call
    localStorage.setItem("mappedData", JSON.stringify(payload.gRCValuesDetails));
    console.log("Mapped data stored in localStorage:", JSON.stringify(payload.gRCValuesDetails, null, 2));

    // API call
    const response = await axios.post(
      "https://sandboxgathernexusapi.azurewebsites.net/api/GRC/InsertUpdateGroupClassMappingDetail",
      payload,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log full response
    console.log("API Response:", response);

    if (response.data.responseStatus === 3) {
      console.log("Update successful:", response.data);
      alert("Mappings updated successfully!");
    } else {
      console.error("Update failed:", response.data.message);
      alert(`Error: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Error updating mappings:", error);
    alert("An error occurred while updating mappings.");
  }
};

    
    const PreviewModal: React.FC<{
      visible: boolean;
      onClose: () => void;
      mappings: Mapping[];
      classValues: ClassValue[];
      regions: Region[];
    }> = ({ visible, onClose, mappings, classValues, regions }) => {
      return (
        <Modal
          title="Mapped Data Preview"
          visible={visible}
          onCancel={onClose}
          footer={null}
          width="100vw"
          style={{ top: 0, padding: 0 }}
          bodyStyle={{ height: "100vh", overflow: "auto", padding: "24px" }}
        >
          <div style={{ display: "flex", gap: "24px", height: "100%" }}>
            {/* Left Column */}
            <Card title="Class Values & Mapped Regions" style={{ flex: 1, overflow: "auto" }}>
              {mappings.map((mapping) => {
                const classValue = classValues.find((cv) => cv.id === mapping.classValueId);
                if (!classValue) return null;
    
                return (
                  <div key={classValue.id} style={{ marginBottom: "16px" }}>
                    <Title level={5}>{classValue.name}</Title>
                    <ul>
                      {mapping.regionIds.map((regionId) => {
                        const region = regions.find((r) => r.id === regionId);
                        return region ? <li key={region.id}>{region.name}</li> : null;
                      })}
                    </ul>
                  </div>
                );
              })}
            </Card>
    
            {/* Right Column */}
            <Card title="Available Regions" style={{ flex: 1, overflow: "auto" }}>
              <ul>
                {regions
                  .filter((region) => !mappings.some((m) => m.regionIds.includes(region.id)))
                  .map((region) => (
                    <li key={region.id}>{region.name}</li>
                  ))}
              </ul>
            </Card>
          </div>
        </Modal>
      );
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
              <Button icon={<EyeOutlined />} onClick={handlePreview}>Preview</Button>
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
              {/* Second Column: Mapped Regions */}
  <Card 
    title="Mapped Regions"
    style={{ width: '33%', minHeight: '500px' }}
    bodyStyle={{ padding: 0 }}
  >
    {mappings
      .filter((m) => m.regionIds.length > 0)
      .map((mapping) => (
        <div key={mapping.classValueId} style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
          <strong>{classValues.find((cv) => cv.id === mapping.classValueId)?.name}</strong>
          {mapping.regionIds.map((regionId) => {
            const region = regions.find((r) => r.id === regionId);
            return region ? (
              <DraggableRegion
                key={region.id}
                region={region}
                isInMappingColumn={true}
                classValueId={mapping.classValueId}
                onRemoveMapping={handleRemoveMapping}
              />
            ) : null;
          })}
        </div>
      ))}
      
    {mappings.every((m) => m.regionIds.length === 0) && (
      <div style={{ padding: '16px', color: '#999' }}>
        No mapped regions available
      </div>
    )}
  </Card>

              
              {/* Third Column: Available Regions */}
              {/* Third Column: Available Regions */}
  {/* Third Column: Available Regions */}
  <Card 
    title="Available Regions"
    style={{ width: '33%', minHeight: '500px' }}
    bodyStyle={{ padding: 0 }}
  >
    {availableRegions
      .filter(region => !mappings.some(m => m.regionIds.includes(region.id))) // Remove mapped regions
      .map((region, index) => (
        <div key={region.id} id={`available-region-${index}`} style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
          <DraggableRegion
            region={region}
            isInMappingColumn={false}
            onMapped={handleAddMapping}
          />
        </div>
    ))}

    {availableRegions.filter(region => !mappings.some(m => m.regionIds.includes(region.id))).length === 0 && (
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
              <Button type="primary" style={{ backgroundColor: '#1B6F71' }} onClick={handleUpdate} >Update</Button>
              <Button>Cancel</Button>
            </div>

            {/* --- Modal for Preview --- */}
            <PreviewModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            mappings={mappings}
            classValues={classValues}
            regions={regions}
          />


          </Content>
        </Layout>
      </DndProvider>
    );
  };

  export default MapGroup;