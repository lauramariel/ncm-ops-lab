echo "Running anomaly detection"
python /home/nutanix/ncc/bin/health_client.py --run_sync=True health_checks anomaly_checks anomaly_metric_checks
echo "Ran anomaly detection"