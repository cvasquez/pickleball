import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import LoggedInLayout from '../layouts/LoggedIn';
import {
  Group,
  Input,
  Button,
  Switch,
  NumberInput
} from '@mantine/core';

const Settings = () => {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    zipCode: '',
    skillLevel: '',
    isSearchable: undefined,
  });
  const { data: session } = useSession();

  useEffect(() => {
    if (!session || !session.user || !session.user.email) {
      return;
    }

    console.log(session.user)

    const fetchUserData = async () => {
      try {
        // Get user ID based on email when component mounts if user is logged in
        const response = await fetch(`/api/users?email=${session.user.email}`);
        if (response.status === 200) {
          const userData = await response.json();
          setFormData({
            ...formData,
            name: userData.name,
            zipCode: userData.zipCode,
            displayName: userData.displayName,
            isSearchable: userData.isSearchable,
            skillLevel: userData.skillLevel,
          });
        } else {
          // Handle errors as you see fit
          console.error("Error fetching user data");
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    }

    fetchUserData();
  }, [session]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleChange = (name) => (value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!session || !session.user) {
      return;
    }

    if (!session.user.email) {
      return;
    }

    setFormData({ ...formData, isSubmitting: true });

    console.log(formData.skillLevel);

    const response = await fetch(`/api/users?email=${session.user.email}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        email: session.user.email,
      }),
    });

    // Post was successful
    if (response.status === 200) {
      setFormData({ ...formData, isSubmitting: false, isUpdated: true });

      // I have to add a success notification here
    } else {
      // I have to add error handline here
    }
  };


  return (
    <LoggedInLayout>
      <Group position='center'>
        <Input.Wrapper label='Name'>
          <Input
            label='Name'
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
          />
        </Input.Wrapper >
        <Input.Wrapper label='Display Name'>
          <Input
            label='Display Name'
            type='text'
            name='displayName'
            value={formData.displayName}
            onChange={handleChange}
          />
        </Input.Wrapper >
        <Input.Wrapper label='Zip Code'>
          <Input
            label='Zip Code'
            type='number'
            name='zipCode'
            value={formData.zipCode}
            onChange={handleChange}
          />
        </Input.Wrapper>
        <Switch
          checked={formData.isSearchable}
          label='Appear in Search'
          onChange={handleToggleChange('isSearchable')} onChange={() => setFormData(prev => ({ ...prev, isSearchable: !prev.isSearchable }))}
        />
        <NumberInput
          label='DUPR Rating'
          placeholder='Enter your DUPR rating'
          value={formData.skillLevel}
          name='skillLevel'
          onChange={(value) => { setFormData({ ...formData, skillLevel: value }) }}
          min={1}
          max={7}
          precision={2}
          step={0.01}
        />
        <Button onClick={handleSubmit}>Save Settings</Button>
      </Group>
    </LoggedInLayout>
  );
};

export default Settings;