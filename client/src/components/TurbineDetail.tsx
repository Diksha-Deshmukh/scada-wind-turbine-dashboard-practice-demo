import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Grid,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex
} from '@chakra-ui/react';
import { drawLineChart } from '../utils/chart';

interface Turbine {
  id: number;
  name: string;
  site: string;
}

interface Telemetry {
  id: number;
  timestamp: string;
  turbineId: number;
  windSpeed: number;
  powerOutput: number;
  vibration: number;
  temperature: number;
}

interface Alarm {
  id: number;
  timestamp: string;
  turbineId: number;
  description: string;
  severity: string;
  resolved?: boolean;
}

function TurbineDetail() {
  const turbineId = 1;

  const [turbine, setTurbine] = useState<Turbine | null>(null);
  const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const turbinesRes = await fetch('/api/turbines');
        const turbinesData: Turbine[] = await turbinesRes.json();

        const telemetryRes = await fetch(`/api/telemetry/${turbineId}`);
        const telemetryData: Telemetry[] = await telemetryRes.json();

        const alarmsRes = await fetch('/api/alarms');
        const alarmsData: Alarm[] = await alarmsRes.json();

        setTurbine(turbinesData.find(t => t.id === turbineId) ?? null);
        setTelemetry(telemetryData);
        setAlarms(alarmsData.filter(a => a.turbineId === turbineId));
        setError('');
      } catch {
        setError('Unable to load dashboard data. Please check if backend is running.');
      }
    };

    fetchData();

    const interval = window.setInterval(fetchData, 5000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (telemetry.length === 0) return;

    const labels = telemetry.map(t => new Date(t.timestamp));

    drawLineChart('wind', labels, telemetry.map(t => t.windSpeed), {
      yLabel: 'm/s',
      lineColor: '#00e0a4'
    });

    drawLineChart('power', labels, telemetry.map(t => t.powerOutput), {
      yLabel: 'MW',
      lineColor: '#1e88ff'
    });

    drawLineChart('vibration', labels, telemetry.map(t => t.vibration), {
      yLabel: 'm/s²',
      lineColor: '#ffb300'
    });

    drawLineChart('temp', labels, telemetry.map(t => t.temperature), {
      yLabel: '°C',
      lineColor: '#ff4f78'
    });
  }, [telemetry]);

  if (error) {
    return (
      <Box bg="#161b24" color="white" minH="100vh" p={6}>
        {error}
      </Box>
    );
  }

  if (!turbine) {
    return (
      <Box bg="#161b24" color="white" minH="100vh" p={6}>
        Loading...
      </Box>
    );
  }

  const latest = telemetry[telemetry.length - 1];

  return (
    <Box bg="#161b24" minH="100vh" p={6} color="white">
      <Flex justify="space-between" align="flex-start" mb={6}>
        <Box>
          <Text fontSize="3xl" color="green.400" fontWeight="bold">
            {turbine.name}
          </Text>
          <Text color="gray.300">Site: {turbine.site}</Text>
        </Box>

        <Box textAlign="right">
          <Badge colorScheme="green">Online</Badge>
          <Text fontSize="sm" mt={2}>
            Last Update:{' '}
            {latest ? new Date(latest.timestamp).toLocaleString() : 'N/A'}
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap={4} mb={6}>
        <Metric title="Wind Speed" value={`${latest ? latest.windSpeed.toFixed(2) : '--'} m/s`} color="green.300" />
        <Metric title="Power Output" value={`${latest ? latest.powerOutput.toFixed(2) : '--'} MW`} color="blue.300" />
        <Metric title="Vibration" value={`${latest ? latest.vibration.toFixed(2) : '--'} m/s²`} color="yellow.300" />
        <Metric title="Temperature" value={`${latest ? latest.temperature.toFixed(2) : '--'} °C`} color="pink.300" />
      </Grid>

      <Grid templateColumns={{ base: '1fr', xl: 'repeat(2, 1fr)' }} gap={6}>
        <ChartCard title="Wind Speed">
          <canvas id="wind" width="700" height="230" />
        </ChartCard>

        <ChartCard title="Power Output">
          <canvas id="power" width="700" height="230" />
        </ChartCard>

        <ChartCard title="Vibration">
          <canvas id="vibration" width="700" height="230" />
        </ChartCard>

        <ChartCard title="Temperature">
          <canvas id="temp" width="700" height="230" />
        </ChartCard>
      </Grid>

      <Box mt={8} bg="#242a3a" p={4} borderRadius="lg" overflowX="auto">
        <Text fontSize="lg" mb={4} fontWeight="bold">
          Recent Alarms
        </Text>

        {alarms.length > 0 ? (
          <Table variant="simple" colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th color="gray.300">Time</Th>
                <Th color="gray.300">Severity</Th>
                <Th color="gray.300">Description</Th>
                <Th color="gray.300">Status</Th>
              </Tr>
            </Thead>

            <Tbody>
              {alarms.map(alarm => (
                <Tr key={alarm.id}>
                  <Td>{new Date(alarm.timestamp).toLocaleString()}</Td>
                  <Td>
                    <Badge colorScheme={alarm.severity === 'critical' ? 'red' : 'yellow'}>
                      {alarm.severity}
                    </Badge>
                  </Td>
                  <Td>{alarm.description}</Td>
                  <Td>
                    <Badge colorScheme={alarm.resolved ? 'green' : 'gray'}>
                      {alarm.resolved ? 'Resolved' : 'Active'}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Text>No recent alarms</Text>
        )}
      </Box>
    </Box>
  );
}

function Metric({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <Box bg="#242a3a" p={4} borderRadius="lg">
      <Text color="gray.300">{title}</Text>
      <Text fontSize="2xl" fontWeight="bold" color={color}>
        {value}
      </Text>
    </Box>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box bg="#242a3a" p={4} borderRadius="lg" minH="280px">
      <Text mb={3} fontWeight="bold">
        {title}
      </Text>
      <Box w="100%" overflow="hidden">
        {children}
      </Box>
    </Box>
  );
}

export default TurbineDetail;